#if defined(unix) || defined(__unix__) || defined(__unix)
#include "linuxstatscore.h"
#include <QFile>
#include <QDebug>
#include <QStringListModel>
#include <QRegularExpression>
#include <QTime>

LinuxStatsCore::LinuxStatsCore(int msec, QObject *parent)
    :GenericStatsCore(msec, parent)
{

}

LinuxStatsCore::~LinuxStatsCore()
{

}

void LinuxStatsCore::updateProcesses()
{
    return GenericStatsCore::updateProcesses();
}

void LinuxStatsCore::gatherStaticInformation()
{
    qDebug() << "Gathering linux static information";
    // get total memory
    QFile meminfo("/proc/meminfo");
    QRegularExpression rx;
    if(meminfo.open(QIODevice::ReadOnly))
    {
        QString content(meminfo.readAll());
        rx.setPattern("MemTotal:\\s+([0-9]+) kB");
        this->staticSystemInfo_[StatsCore::StaticSystemField::TotalMemory] = QString::number(rx.match(content).captured(1).toLongLong() * 1024);
    }
    return;
}

void LinuxStatsCore::updateSystemInfo()
{
    qDebug() << "Linux update system information";
    // update temperature
    QFile inputFile("/sys/class/hwmon/hwmon0/temp1_input");
    if(inputFile.open(QIODevice::ReadOnly))
    {
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Temperature), QString::number(QString(inputFile.readAll()).toInt() / 1000.0, 'f', 1));
        inputFile.close();
    }

    // update up time
    QFile uptime("/proc/uptime");
    if(uptime.open(QIODevice::ReadOnly))
    {
        QStringList uptimeContent = QString(uptime.readAll()).split(" ");
        double seconds = uptimeContent.at(0).toDouble();
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::UpTime), QTime::fromMSecsSinceStartOfDay(static_cast<int>(seconds * 1000)).toString());
        uptime.close();
    }

    // update process number
    QFile stat("/proc/stat");
    if(stat.open(QIODevice::ReadOnly))
    {
        QString content(stat.readAll());
        rx.setPattern("processes ([0-9]+)");
        this->systemModel_->setData(this->systemModel_->index(StatsCore::DynamicSystemField::Processes), rx.match(content).captured(1));
        stat.close();
    }
    return;
}

#endif
