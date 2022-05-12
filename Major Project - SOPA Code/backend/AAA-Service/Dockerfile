FROM python:3.7-slim
RUN pip3 install fastapi uvicorn
COPY ./controller /controller
COPY ./requirements.txt /requirements.txt
COPY ./common_files /common_files
COPY ./model /model
COPY ./interfaces /interfaces
COPY ./service /service
COPY ./schema /schema
RUN pip install -r requirements.txt
CMD ["uvicorn", "controller.main:app", "--host","0.0.0.0","--port","8080"]