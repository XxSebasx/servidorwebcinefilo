#!/bin/bash

set -e

# Instalar Docker si no está
if ! command -v docker &> /dev/null; then
  echo "Instalando Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
fi

# Instalar Docker Compose v2 manualmente si no existe
if ! docker compose version &> /dev/null; then
  echo "Instalando Docker Compose v2..."
  DOCKER_COMPOSE_VERSION="2.24.5"
  mkdir -p ~/.docker/cli-plugins/
  curl -SL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  chmod +x ~/.docker/cli-plugins/docker-compose
fi

# Clonar el repositorio si no existe
REPO_URL="https://github.com/XxSebasx/servidorwebcinefilo"
DIR="servidorweb-main"

if [ ! -d "$DIR" ]; then
  git clone "$REPO_URL" "$DIR"
else
  echo "Directorio '$DIR' ya existe. No se vuelve a clonar."
fi

# Entrar al directorio y levantar contenedores
cd "$DIR"
docker compose up -d --build

# Esperar a que la base de datos esté lista
echo "⏳ Esperando que la base de datos esté lista..."
until docker exec servidorweb-main-db-1 mysqladmin ping -hlocalhost -uroot -pexample --silent; do
  sleep 2
done

# Ejecutar los inserts
echo "⚙️ Insertando datos por defecto en la base de datos..."
docker exec -i servidorweb-main-db-1 mysql -uroot -pexample catalogocine <<EOF
INSERT INTO \`peliculas\` (\`ID\`, \`titulo\`, \`anio_estreno\`, \`descripcion\`, \`director\`, \`genero\`, \`duracion\`, \`portada\`, \`trailer\`, \`valoracion\`)
VALUES
(1, 'jurassic park', '1993-09-30 00:00:00', 'El multimillonario John Hammond hace realidad su sueño de clonar dinosaurios...', 'Steven Spielberg', 'ciencia ficcion', '2h', 'http://172.20.0.10:3000/uploads/1746101861761-997615221.jpg', 'https://www.youtube.com/embed/QWBKEmWWL38?si=L-TK9-liL7RfnVDJ', 5);
EOF

echo "✅ Aplicación desplegada y datos insertados. Accede a http://172.20.0.10:3000"


