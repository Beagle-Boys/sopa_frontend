from base64 import b64decode
from typing import List
from uuid import uuid4
from common_files.config import s3_client
from fastapi import BackgroundTasks
from common_files.constants import PRIVATE_IMAGE_BUCKET
from botocore.client import ClientError
from common_files.utils import logger
import io

class SpotImageService:
    def __init__(self, user_id: str) -> None:
        self.user_id = user_id

    def __save_image(self, image_id: str, base64_data: str):
        object_id = f'{image_id}.jpeg'
        file = base64_data
        if ',' in file:
            file = file.split(',')[1]
        try:
            s3_client.upload_fileobj(
                io.BytesIO(b64decode(file)),
                PRIVATE_IMAGE_BUCKET,
                object_id
            )
        except ClientError as e:
            logger.error(e)
            return False
        return True

    def add_images(self, base64_images: List[str], background_tasks: BackgroundTasks) -> List[str]:
        base64_images = base64_images[:5]
        ids = [str(uuid4()) for _ in base64_images]
        for image_id, base64_image in zip(ids, base64_images):
            background_tasks.add_task(self.__save_image, image_id, base64_image)
        return ids