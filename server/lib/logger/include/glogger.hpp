/**
 * @file glogger.hpp
 * @brief Single Header Logger
 * @copyright Shoshin Ilya (Galarius) no warranty implied; use at your own risk
 * 
 * Usage:
 * Add `#define __glogger_implementation__` before you include 
 * this file in ONE C or C++ file to create the implementation.
 */

#pragma once

#include <iostream>
#include <fstream>
#include <sstream>
#include <mutex>
#include <chrono>
#include <ctime>

#define GLogTrace(...) do { GLogger::instance().logTrace(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)
#define GLogDebug(...) do { GLogger::instance().logDebug(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)
#define GLogInfo(...)  do { GLogger::instance().logInfo(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)
#define GLogWarn(...)  do { GLogger::instance().logWarn(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)
#define GLogError(...) do { GLogger::instance().logError(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)
#define GLog(...) do { GLogger::instance().log(__FUNCTION__,":",__LINE__," ",##__VA_ARGS__); } while(false)

/**
* @class GLogger
* @brief Singleton class for logging
* 
* Usage example:
* @code{.cpp}   
*     #include <...>
*     #include <...>
*     #include "..."
*     #define __glogger_implementation__    // define this only once
*     #include "glogger.hpp"
*  
*     void main()
*     {
*         // GLogger setup
*         GLogger::instance().SetOutputMode(GLogger::Output::Both); // output to console and file
*         GLogger::instance().SetMinLevel(GLogger::Output::Console, GLogger::Level::Info);  // min console level
*         GLogger::instance().SetMinLevel(GLogger::Output::File, GLogger::Level::Trace);    // min file level
*         GLogger::instance().SetMaxLogFileSize(2000000);         // max log file size in bytes, 2Mb
*         GLogger::instance().SetLogFilename("glogger.log");        // log file name
*         //...
*         try
*         {
*           //...
*         }
*         catch(std::runtime_error& e)
*         {
*           GLogger::instance().logError("operation failed. reason:", e.what());
*         }
*     }
*  @endcode
*/
class GLogger
{
    GLogger();  
    GLogger(const GLogger&) = delete;  
    GLogger& operator=(const GLogger&) = delete;
public:
    /**
     * @brief Get single instance of GLogger
     */
    static GLogger& instance();
    ~GLogger() = default;
public:
    /**
     * @brief Output logger mode
     */
    enum Output : unsigned int
    {
        ///@{
        Off = 0,    ///< disabled
        Console,    ///< console only
        File,       ///< log file only
        Both        ///< console and log file
        ///@}
    };
    /**
     * @brief Logger level
     */
    enum Level : unsigned int
    {
        ///@{
        Trace = 0,  ///< verbose output (the lowest level)
        Debug,      ///< for debugging
        Info,       ///< for progress notifications
        Warn,       ///< warnings
        Error,      ///< errors
        None        ///< invariant to level (e.g. greeting message)
        ///@}
    };
    
    /**
     * @brief Set output logger mode
     * @param[in] mode logger mode
     * @see Output
     */
    void SetOutputMode(Output mode);
    /**
     * @brief Set min logger level for specified target to filter messages
     * @param[in] target file, console or both
     * @param[in] level min level to print
     * @see Output
     * @see Level
     */
    void SetMinLevel(Output target, Level level);
    GLogger::Level GetLevel();
    /**
     * @brief Set log filename to begin file logging
     * @param[in] filename log file name
     * @note If file size exceeds m_maxLogFileSize,
     * new log file will be created
     */
    void SetLogFilename(const std::string& filename);
    /**
     * @brief Set max log file size
     * @param[in] size max log file size in bytes
     * 
     * If file size exceeds m_maxLogFileSize,
     * new log file will be created.
     */
    void SetMaxLogFileSize(size_t size);
    /**
     * @brief Skip empty messages
     * param[in] flag skip or allow
     */
    void SetSkipEmptyMessages(bool flag);
    /**
     * @brief Trim leading and trailing spaces in messages
     * param[in] flag enable/disable
     */
    void SetTrimMessages(bool flag);
    /**
     * @brief Set symbol to separate level from message, e.g. `[Level]:Message`
     * param[in] separator separation symbol
     */
    void SetSeparator(const std::string& separator);
    /**
     * @brief Begin recording log messages
     * @note Recording uses the same min log level as console
     * @see EndRecord
     */
    void StartRecord();
    /**
     * @brief Stop recording log messages
     * @return string with recorded log messages
     * @note must be called after StartRecord
     * @see StartRecord
     */
    std::string EndRecord();
public:
    /**
     * @brief Logging without level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void log(Args&&... args)
    {
        InnerLog(None, std::forward<Args>(args)...);
    }
    /**
     * @brief Logging with trace level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void logTrace(Args&&... args)
    {
        InnerLog(Trace, std::forward<Args>(args)...);
    }
    /**
     * @brief Logging with debug level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void logDebug(Args&&... args)
    {
        InnerLog(Debug, std::forward<Args>(args)...);
    }
    /**
     * @brief Logging with info level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void logInfo(Args&&... args)
    {
        InnerLog(Info, std::forward<Args>(args)...);
    }
    /**
     * @brief Logging with warn level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void logWarn(Args&&... args)
    {
        InnerLog(Warn, std::forward<Args>(args)...);
    }
    /**
     * @brief Logging with error level
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void logError(Args&&... args)
    {
        InnerLog(Error, std::forward<Args>(args)...);
    }
private:
    /**
     * @brief unpacks the last argument of variadic
     * template arguments sequence
     * @tparam T argument type
     */
    template<typename T>
    void unpack(T t)
    {
        m_bufferUnpack << t;
    }
    /**
     * @brief unpacks variadic template arguments sequence
     * @tparam T first argument type
     * @tparam Args other arguments types
     */
    template<typename T, typename ...Args>
    void unpack(T t, Args&&... args)
    {
        m_bufferUnpack << t;
        unpack(std::forward<Args>(args)...);
    }
    /**
     * @brief Write constructed message to file or stdout/stderr
     * @param[in] level log level
     * @param[in] message message to write
     */
    void WriteLogMessage(Level level, std::string& message);
    /**
     * @brief Inner logging method to perform console/file output
     * @param[in] args arguments for logging
     * @see Level
     */
    template<typename ...Args>
    void InnerLog(Level level, Args&&... args)
    {
        m_writeLock.lock();
        unpack(std::forward<Args>(args)...); // unpack arguments and build message
        std::string message = m_bufferUnpack.str();
        message.shrink_to_fit();
        m_bufferUnpack.str(std::string());	 // clear message buffer
        WriteLogMessage(level, message);
        m_writeLock.unlock();
    }
private:
    /**
     * @brief Get string name from Level
     * @param[in] lvl from Level enumeration
     * @return lvl string name
     * @see Level
     */
    static std::string LevelName(Level lvl);
    /**
     * @brief Copy file from one location to another
     * @param[in] from source
     * @param[in] to destination
     */
    static void CopyFile(const std::string &from, const std::string &to);
    /**
     * @brief Get file size
     * @brief filename file name
     * @return file size in bytes
     */
    static std::ifstream::pos_type FileSize(const std::string& filename);
    /**
     * @brief Checks whether file exists
     * @param[in] filename file name
     */
    static bool Exists(const std::string& filename);
    /**
     * @brief Current time as string
     */
    static std::string CurrentTime(bool onlyTime = true);
    /**
     * @brief Remove leading and trailing spaces
     * @brief[in,out] s string to trim
     */
    static void Trim(std::string& s);
    /**
     * @brief Get path basename
     * @param[in] pathname path
     */
    static std::string Basename(const std::string& pathname);
private:
    // Options
    Level m_minLevelConsole;			///< @brief console min log level
    Level m_minLevelFile;				///< @brief file min log level
    Output m_output;				    //< @brief output mode
    bool m_skipEmptyMsgs;               ///< @brief skip empty messages toggle
    bool m_trimMessages;                ///< @brief remove whitespaces
    std::string m_logFile;				///< @brief log file name
    size_t m_maxLogFileSize;            ///< @brief max log file size
    std::string m_separator;            ///< @brief symbol to separate level from message, e.g. `:` or `>`
    // Helpers
    std::stringstream m_bufferUnpack;	///< @brief temp buffer for variadic template arguments unpacking
    std::stringstream m_bufferRecord;	///< @brief temp buffer for recording log messages into a string
    bool m_recordEnabled;				///< @brief recording toggle
    std::ofstream m_fout;				///< @brief log file output stream
    std::mutex m_writeLock;             ///< @brief mutex for logging
};

#ifdef __glogger_implementation__

    #include <algorithm>	// std::find_if
    #include <functional>	// std::ptr_fun<int, int>
    #include <cctype>		// std::isspace

    GLogger& GLogger::instance()
    {
        /* In C++11 thread-safety initialization and 
         destruction is enforced in the standard */
        static GLogger logger;
        return logger;
    }
    
    GLogger::GLogger() :
          m_minLevelConsole(Level::None)
        , m_minLevelFile(Level::None)
        , m_output(Output::Off)
        , m_skipEmptyMsgs(false)
        , m_trimMessages(false)
        , m_maxLogFileSize(2000000) // 2 Mb
        , m_recordEnabled(false)
        , m_separator(" ")
    { }

    void GLogger::WriteLogMessage(Level level, std::string& message)
    {
        if(m_trimMessages)
            Trim(message);
        
        if (m_output != Off && !(m_skipEmptyMsgs && message.empty()) )
        {
            std::string snow = CurrentTime();
            if (level >= m_minLevelFile)
            {
                if((m_output == File || m_output == Both) && m_fout.good())
                {
                    m_fout << snow << m_separator << LevelName(level) << m_separator << message << std::endl;
                }
                else if(m_output == Console || m_output == Both)
                {
                    if (level == Level::Error)
                    {
                        std::cerr << snow << m_separator << LevelName(level) << m_separator << message << std::endl;
                    }
                    else
                    {
                        std::cout << snow << m_separator << LevelName(level) << m_separator << message << std::endl;
                    }
                }
            }
        }
        // recording
        if (m_recordEnabled && level >= m_minLevelConsole)
            m_bufferRecord << message << std::endl;
    }

    //-----------------------------------------------------------------------------------------
    // mutators
    //-----------------------------------------------------------------------------------------

    void GLogger::SetOutputMode(Output mode)
    {
        m_output = mode;
    }

    void GLogger::SetMinLevel(Output target, Level level)
    {
        switch (target)
        {
            case Console:
                m_minLevelConsole = level;
                break;
            case File:
                m_minLevelFile = level;
                break;
            case Both:
                m_minLevelConsole = level;
                m_minLevelFile = level;
                break;
            default:
                std::cerr << "[GLogger Error]: invalid target" << std::endl;
                break;
        }
    }

    GLogger::Level GLogger::GetLevel()
    {
        return m_minLevelConsole;
    }

    void GLogger::SetLogFilename(const std::string& filename)
    {
        static std::locale sysLoc("");	// get system locale
        m_logFile = filename;
        
        if (!m_logFile.empty())
        {
            std::string snow = CurrentTime(false);
            if (m_output == File || m_output == Both)
            {
                if (Exists(m_logFile) && FileSize(m_logFile) > m_maxLogFileSize)
                {
                    std::string bname = Basename(m_logFile);
                    CopyFile(m_logFile, snow + "_" + bname);
                    m_fout.open(m_logFile, std::ios::out);
                }
                else
                {
                    m_fout.open(m_logFile, std::ios::out | std::ios::app);
                }
                if (m_fout.good())
                {
                    m_fout.imbue(sysLoc);
                    m_fout << std::endl
                    << "----------------------------------------------------------------" << std::endl
                    << "--------------------" << snow << "--------------------" << std::endl
                    << "----------------------------------------------------------------"
                    << std::endl << std::endl;
                }
                else
                {
                    GLogger::instance().logError("failed to open log file");
                }
            }
        }
    }
    
    void GLogger::SetMaxLogFileSize(size_t size)
    {
        m_maxLogFileSize = size;
    }

    void GLogger::SetSkipEmptyMessages(bool flag)
    {
        m_skipEmptyMsgs = flag;
    }

    void GLogger::SetTrimMessages(bool flag)
    {
        m_trimMessages = flag;
    }

    void GLogger::SetSeparator(const std::string& separator)
    {
        m_separator = separator;
    }

    //-----------------------------------------------------------------------------------------
    // recording
    //-----------------------------------------------------------------------------------------

    void GLogger::StartRecord()
    {
        if (!m_recordEnabled)
        {
            m_recordEnabled = true;
        }
        else
        {
            GLogger::instance().logError("already recording!");
        }
    }

    std::string GLogger::EndRecord()
    {
        std::string text;
        if (m_recordEnabled)
        {
            m_recordEnabled = false;
            text = m_bufferRecord.str();
            m_bufferRecord.str(std::string());
        }
        else
        {
            GLogger::instance().logError("recording is not started!");
        }
        return text;
    }

    //-----------------------------------------------------------------------------------------
    // static helpers
    //-----------------------------------------------------------------------------------------

    std::string GLogger::LevelName(Level lvl)
    {
        static std::string levels[] {"TRE", "DBG", "INF", "WRN", "ERR", ""};
        return levels[lvl];
    }

    void GLogger::CopyFile(const std::string &from, const std::string &to)
    {
        std::ifstream is(from, std::ios::in | std::ios::binary);
        std::ofstream os(to, std::ios::out | std::ios::binary);
        os << is.rdbuf();
    }

    std::ifstream::pos_type GLogger::FileSize(const std::string& filename)
    {
        std::ifstream in(filename, std::ifstream::binary | std::ios::ate);
        return in.tellg();
    }

    bool GLogger::Exists(const std::string& name)
    {
        std::ifstream f(name);
        return f.good();
    }

    std::string GLogger::CurrentTime(bool onlyTime)
    {
        auto now = std::chrono::system_clock::now();
        char buffer[80];
        auto transformed = now.time_since_epoch().count() / 1000000;
        auto millis = transformed % 1000;
        auto tt = std::chrono::system_clock::to_time_t ( now );
        auto timeinfo = localtime (&tt);
        if(onlyTime)
        {
            strftime (buffer, sizeof(buffer), "%H:%M:%S", timeinfo);
            sprintf(buffer, "%s:%03d", buffer, (int)millis);
        }
        else
        {
            strftime (buffer, sizeof(buffer), "%F %H:%M:%S", timeinfo);
        }
        return std::string(buffer);
    }

    void GLogger::Trim(std::string& s) {
#ifdef _WIN32
        bool if_ascii = std::all_of(s.begin(), s.end(),
                                    [](char c) { return c >= -1 && c < 255; });
#else
        bool if_ascii = true;
#endif
        if(if_ascii)
        {
            // ltrim
            s.erase(s.begin(), find_if(s.begin(), s.end(),
                    std::not_fn(::isspace)));
            // rtrim
            s.erase(find_if(s.rbegin(), s.rend(), std::not_fn(::isspace)).base(),
                    s.end());
        }
    }

std::string GLogger::Basename(const std::string& pathname) {
    return std::string(std::find_if(pathname.rbegin(), pathname.rend(),
            [](char ch) {
#ifdef _WIN32
                return ch == '\\';
#else
                return ch == '/';
#endif
            }).base(),
        pathname.end());
    }

#endif  // __glogger_implementation__
