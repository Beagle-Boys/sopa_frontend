from common_files.enums import Code


class SopaExceptions(Exception):
    """
    Custom exception for SOPA APP to be used for specific repeatable
    app related exceptions.
    """

    def __init__(self, *args):
        if args:
            self.error_code = args[0]
        else:
            self.error_code = None

    def __str__(self):
        if self.error_code:
            return '{0}'.format(Code().sopa_error_enum(self.error_code))
        else:
            return 'SOPA Custom Error Raised'