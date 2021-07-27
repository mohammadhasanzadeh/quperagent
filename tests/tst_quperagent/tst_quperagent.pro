CONFIG += warn_on qmltestcase

include($$PWD/../../quperagent.pri)

TEMPLATE = app

DISTFILES += \
    js/interceptors.js \
    tst_quperagent.qml

SOURCES += \
    main.cpp
