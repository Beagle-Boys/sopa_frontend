from fastapi import HTTPException, Header
from common_files.common_constants import X_INTERNAL_KEY, X_PRODUCT_KEY


async def verify_host(
    x_internal_key: str = Header(None),
    x_product_key: str = Header(None)
    ):
    """
    middleware to verify x-internal-header token
    args:
        x-internal-header: received as header param. Contains a hex encoded auth token
    raises:
        401 : Unauthorized when token is not matched.
    returns:
        None: return value for dependencies like these are discarded even
              though if something is returned
    """

    if x_internal_key == X_INTERNAL_KEY:
        pass
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")


    if x_product_key == X_PRODUCT_KEY:
        pass
    else:
        raise HTTPException(statis_code=400, detail="Missing product key")