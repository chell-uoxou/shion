FROM postgres:16

RUN apt-get update && apt-get install -y curl tar && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.0/migrate.linux-amd64.tar.gz \
  | tar xvz -C /usr/local/bin

ENTRYPOINT ["migrate"]
