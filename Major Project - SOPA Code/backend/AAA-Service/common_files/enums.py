class Code(object):
    """
    enum code to every custom errors used for SOPA APP.
     1xxx - User registration and Login
    """
    error_enum = {
        1001: "Mobile No. Already Exists",
        1002: "Wrong Password or Email",
        1003: "Mobile No. Not Found",
        1004: "Oops! Unexpected error occurred",
        1005: "User is Locked !",
        1006: "Incorrect OTP",
        3001: "App Issue"
    }

    @staticmethod
    def sopa_error_enum(code):
        return Code.error_enum[code]