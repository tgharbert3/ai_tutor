from bullmq import Queue

def createCheckRunCompletetionQueue():
    return Queue("checkRunCompletion")
