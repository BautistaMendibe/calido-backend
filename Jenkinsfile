def nodo_1 = ""
def nodo_2 = ""
def nodo_3 = ""
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Creando imágen....'
        script {
          dockerInstance = docker.build(imageName, "--build-arg environment=${env.GIT_BRANCH} --build-arg http_proxy=http://proxysrv.gobiernocba.gov.ar:8080 --build-arg https_proxy=http://proxysrv.gobiernocba.gov.ar:8080 --no-cache .")
        }
      }
    }
    stage('Publish') {
      steps {
        echo 'Publicando imágen al registry...'
        script {
          docker.withRegistry('', registryCredentialSet) {
            dockerInstance.push("$imageNameShort-${env.BUILD_NUMBER}")
            sh "docker build -t $imageName --build-arg environment=${env.GIT_BRANCH} --build-arg http_proxy=http://proxysrv.gobiernocba.gov.ar:8080/ --build-arg https_proxy=http://proxysrv.gobiernocba.gov.ar:8080/  --no-cache ."
            sh "docker push $imageName"
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        script {
          def entorno = "${env.GIT_BRANCH}"
          switch (entorno) {
              case "desarrollo":
              nodo_1 = "${env.DESA_NODO_1}"
              nodo_2 = "${env.DESA_NODO_2}"
              nodo_3 = "${env.DESA_NODO_3}"
              break
              case "testing":
              nodo_1 = "${env.TST_NODO_1}"
              nodo_2 = "${env.TST_NODO_2}"
              nodo_3 = "${env.TST_NODO_3}"
              break
              case "master":
              nodo_1 = "${env.PROD_NODO_1}"
              nodo_2 = "${env.PROD_NODO_2}"
              nodo_3 = "${env.PROD_NODO_3}"
              break
              default:
               println('No existe  el nombre del entorno solicitado.')
              break
          }
        }
        echo 'Comenzando despliegue...'
        echo 'Desplegando nodo 1'
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_1} 'mkdir -p $rootDir'"
        sh "scp ./docker-compose.yml ./docker-compose.override.yml ./.env devuser@${nodo_1}:$rootDir"
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_1} 'export IMAGE_NAME=$imageName && echo \"${env.pwdRegistry}\" | docker login --username ${env.emailRegistry} --password-stdin && cd $rootDir && docker-compose down --rmi all && docker-compose up --build -d && docker logout'"
        echo ''
        echo 'Desplegando nodo 2'
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_2} 'mkdir -p $rootDir'"
        sh "scp ./docker-compose.yml ./docker-compose.override.yml ./.env devuser@${nodo_2}:$rootDir"
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_2} 'export IMAGE_NAME=$imageName && echo \"${env.pwdRegistry}\" | docker login --username ${env.emailRegistry} --password-stdin && cd $rootDir && docker-compose down --rmi all && docker-compose up --build -d && docker logout'"
        echo ''
        echo 'Desplegando nodo 3'
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_3} 'mkdir -p $rootDir'"
        sh "scp ./docker-compose.yml ./docker-compose.override.yml ./.env devuser@${nodo_3}:$rootDir"
        sh "ssh -o StrictHostKeyChecking=no devuser@${nodo_3} 'export IMAGE_NAME=$imageName && echo \"${env.pwdRegistry}\" | docker login --username ${env.emailRegistry} --password-stdin && cd $rootDir && docker-compose down --rmi all && docker-compose up --build -d && docker logout'"
        echo 'Despliegue finalizado'
      }
    }
  }

  environment {
    imageName = "cidsregistry/caja-jubilaciones:consultas-${env.GIT_BRANCH}"
    imageNameShort = "consultas-${env.GIT_BRANCH}"
    registryCredentialSet = 'credenciales-registry'
    rootDir = '/home/devuser/caja/consultas'
  }
}
