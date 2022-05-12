from common_files.enums import Code
import json

class SopaExceptions(Exception):
    """
    Custom exception for SOPA APP to be used for specific repeatable
    app related exceptions.
    """
    
    def __init__(self, code, status_code=None, error_data=None):
        self.error_code = code
        self.status_code = status_code
        self.error_data = error_data

    def __str__(self):
        if self.error_code:
            return '{0}'.format(Code().sopa_error_enum(self.error_code))
        else:
            return 'Custom Error Raised'
    
    def detail(self):
        if self.error_data:
            try:
                data = json.loads(self.error_data)
                if 'detail' in data:
                    try:
                        _data = json.loads(data['detail'])
                        if 'detail' in _data:
                            return _data['detail']
                    except:
                        pass
                    return data['detail']
                return data
            except Exception:
                return str(self.error_data)
        return str(self)
