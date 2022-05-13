FROM python:3.7-slim
RUN pip3 install fastapi uvicorn
COPY ./controller /controller
COPY ./requirements.txt /requirements.txt
COPY ./common_files /common_files
COPY ./models /models
COPY ./interfaces /interfaces
COPY ./services /services
COPY ./schemas /schemas
RUN pip install -r requirements.txt
CMD ["uvicorn", "controller.main:app", "--host","0.0.0.0","--port","8082"]