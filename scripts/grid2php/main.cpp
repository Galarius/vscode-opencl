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

struct table
{
    long ncols;
    bool has_header;
    std::vector<std::vector<std::string>> rows;
    std::vector<int> lines_per_row;
};

bool is_new_row(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c)
        { return c == '+' || c == '-' || c == ':'; });
}

bool is_header(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c)
    { return c == '+' || c == '=' || c == ':'; });
}

bool is_space(const std::string& line)
{
    return std::all_of(line.begin(), line.end(), [](char c) { return std::isspace(c);});
}

bool table_processing(std::string& line, table& tbl)
{
    if(ext::starts_with(line, "+="))        // header
    {
        tbl.has_header = is_header(line);
        tbl.lines_per_row.push_back(0);
    }
    else if(ext::starts_with(line, "|"))    // line
    {
        std::vector<std::string> cols = ext::split(line, "|");
        cols.erase(cols.begin(), cols.begin()+1);
        cols.pop_back();
        tbl.rows.push_back(cols);
        tbl.lines_per_row[tbl.lines_per_row.size()-1] += 1;
    }
    else if(ext::starts_with(line, "+-"))   // new row
    {
        if(is_new_row(line)) {
            tbl.lines_per_row.push_back(0); }
    } else {
        return false;                       // end of table
    }
    return true;
}

void out_single_line_row(std::ofstream& out, const std::vector<std::string>& cols)
{
    out << "|";
    for(auto& col : cols)
        out << col << "|";
    out << std::endl;
}

void generate_php_table(std::ofstream& out, const table& tbl)
{
    int row = 0;
    int line = 0;

    if(tbl.has_header)
    {
        auto cols = tbl.rows[0];
        out_single_line_row(out, cols);
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

    for(;row < tbl.lines_per_row.size(); ++row)
    {
        int l = 0;
        int lines = tbl.lines_per_row[row];
        std::vector<std::string> res_cols;
        for(int col = 0; col < tbl.ncols; ++col) {
            res_cols.push_back("");
        }

        for(; l < lines; ++l) {
            auto cols = tbl.rows[line + l];
            for(int col = 0; col < tbl.ncols; ++col) {
                if(!is_space(cols[col]))
                    res_cols[col] += " " + cols[col];
            }
        }

        out_single_line_row(out, res_cols);
        line += l;
    }
}

void reset(table& tbl)
{
    tbl.ncols = 0;
    tbl.lines_per_row.clear();
    tbl.rows.clear();
    tbl.has_header = false;
}

void process(std::ifstream& in, std::ofstream& out)
{
    table tbl;                  /* markdown table description */
    std::string line;           /* current line */
    bool in_table = false;      /* inside markdown table */
    bool built = false;
    bool table_exists = false;

    for(; !in.eof() && std::getline(in, line);) {

        if(!in_table) {
            if(ext::starts_with(line, "+-")) {   // in markdown table
                // validate
                in_table = is_new_row(line);
                if (in_table) {
                    reset(tbl);
                    built = false;
                    table_exists = true;
                    tbl.ncols = std::count(line.begin(), line.end(), '+') - 1;
                    tbl.lines_per_row.push_back(0);
                }
            } else {
                // other content
                out << line << std::endl;
            }
        } else {
            // table processing
            in_table = table_processing(line, tbl);
            if (!in_table) {
                // finish table processing
                tbl.lines_per_row.pop_back();
                // generate `PHP Markdown Extra` table
                generate_php_table(out, tbl);
                built = true;
            }
        }
    }

    if(table_exists && !built) {
        // if table at the end without blank line
        tbl.lines_per_row.pop_back();
        generate_php_table(out, tbl);
    }
}

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
            process(in, out);
        } else {
            std::cerr << "Failed to open output file." << std::endl;
        }
    } else {
        std::cerr << "Failed to open input file." << std::endl;
    }
    return 0;
}