/**
 * @file
 * @date 11.03.18
 * @author galarius
 * @copyright © Created by galarius, 2017.
 * @brief Tool for conversion markdown `grid_tables` to `PHP Markdown Extra table`
 *
 * Using `grid2php <in_file> <out_file>` will convert grid tables like this one:
 *
 * @code
 * +---------------+---------------+--------------------+
 * | Fruit         | Price         | Advantages         |
 * +===============+===============+====================+
 * | Bananas       | $1.34         | - built-in wrapper |
 * |               |               | - bright color     |
 * +---------------+---------------+--------------------+
 * | Oranges       | $2.10         | - cures scurvy     |
 * |               |               | - tasty            |
 * +---------------+---------------+--------------------+
 * @endcode
 *
 * to `PHP Markdown Extra table`:
 *
 * @code
 * | Fruit         | Price         | Advantages         |
 * | --- | --- | --- |
 * |  Bananas       |  $1.34         |  - built-in wrapper   - bright color     |
 * |  Oranges       |  $2.10         |  - cures scurvy       - tasty            |
 * @endcode
 *
 *
 * ToDo:
 *  - pretty md table alignment
 */

#include <iostream>
#include <fstream>
#include <vector>
#include "utils.hpp"

namespace {

struct table
{
    long ncols;
    bool hasHeader;
    std::vector<std::vector<std::string>> rows;
    std::vector<int> linesPerRow;
};

bool IsNewRow(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c)
        { return c == '+' || c == '-' || c == ':'; });
}

bool IsHeader(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c)
    { return c == '+' || c == '=' || c == ':'; });
}

bool IsSpace(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c) { return std::isspace(c);});
}

bool TableProcessing(std::string& line, table& tbl)
{
    if(ext::StartsWith(line, "+="))        // header
    {
        tbl.hasHeader = IsHeader(line);
        tbl.linesPerRow.push_back(0);
    }
    else if(ext::StartsWith(line, "|"))    // line
    {
        std::vector<std::string> cols = ext::Split(line, "|");
        cols.erase(cols.begin(), cols.begin()+1);
        cols.pop_back();
        tbl.rows.push_back(cols);
        tbl.linesPerRow[tbl.linesPerRow.size()-1] += 1;
    }
    else if(ext::StartsWith(line, "+-"))   // new row
    {
        if(IsNewRow(line)) {
            tbl.linesPerRow.push_back(0); }
    } else {
        return false;                       // end of table
    }
    return true;
}

void OutSingleLineRow(std::ofstream& out, const std::vector<std::string>& cols)
{
    out << "|";
    for(auto& col : cols)
        out << col << "|";
    out << std::endl;
}

void GeneratePhpTable(std::ofstream& out, const table& tbl)
{
    int row = 0;
    int line = 0;

    if(tbl.hasHeader)
    {
        auto cols = tbl.rows[0];
        OutSingleLineRow(out, cols);
        out << "|";
        for(int i = 0; i < cols.size(); ++i)
            out << " --- |";
        out << std::endl;
        ++row;
        ++line;
    }
    else
    {
        out << "|";
        for(int i = 0; i < tbl.ncols; ++i)
            out << "   |";
        out << std::endl;
        for(int i = 0; i < tbl.ncols; ++i)
            out << "---|";
        out << std::endl;
    }

    for(;row < tbl.linesPerRow.size(); ++row)
    {
        int l = 0;
        int lines = tbl.linesPerRow[row];
        std::vector<std::string> res_cols;
        for(int col = 0; col < tbl.ncols; ++col) {
            res_cols.push_back("");
        }

        for(; l < lines; ++l) {
            auto cols = tbl.rows[line + l];
            for(int col = 0; col < tbl.ncols; ++col) {
                if(!IsSpace(cols[col]))
                    res_cols[col] += " " + cols[col];
            }
        }

        OutSingleLineRow(out, res_cols);
        line += l;
    }
}

void Reset(table& tbl)
{
    tbl.ncols = 0;
    tbl.linesPerRow.clear();
    tbl.rows.clear();
    tbl.hasHeader = false;
}

void Process(std::ifstream& in, std::ofstream& out)
{
    table tbl;                  /* markdown table description */
    std::string line;           /* current line */
    bool inTable = false;      /* inside markdown table */
    bool built = false;
    bool tableExists = false;

    for(; !in.eof() && std::getline(in, line);) {

        if(!inTable) {
            if(ext::StartsWith(line, "+-")) {   // in markdown table
                // validate
                inTable = IsNewRow(line);
                if (inTable) {
                    Reset(tbl);
                    built = false;
                    tableExists = true;
                    tbl.ncols = std::count(line.begin(), line.end(), '+') - 1;
                    tbl.linesPerRow.push_back(0);
                }
            } else {
                // other content
                out << line << std::endl;
            }
        } else {
            // table Processing
            inTable = TableProcessing(line, tbl);
            if (!inTable) {
                // finish table Processing
                tbl.linesPerRow.pop_back();
                // generate `PHP Markdown Extra` table
                GeneratePhpTable(out, tbl);
                built = true;
                out << std::endl;
            }
        }
    }

    if(tableExists && !built) {
        // if table at the end without blank line
        tbl.linesPerRow.pop_back();
        GeneratePhpTable(out, tbl);
    }
}

} // namespace ''

int main(int argc, char* argv[])
{

    if(argc != 3) {
        std::cout << "Usage:\n"
                  << "\t" << argv[0] <<" <in_file> <out_file>\n";
        exit(1);

    }

    std::ifstream in(argv[1]);
    if(in.good()) {
        std::ofstream out(argv[2]);
        if(out.good()) {
            Process(in, out);
        } else {
            std::cerr << "Failed to open output file." << std::endl;
        }
    } else {
        std::cerr << "Failed to open input file." << std::endl;
    }
    return 0;
}