class ExceptionWithCode(Exception):

    def __init__(self, code, message):
        self.code = code
        self.message = message
        super().__init__(self.message)
