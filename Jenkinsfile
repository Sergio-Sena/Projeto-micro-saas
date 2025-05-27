pipeline {
    agent {
        docker {
            image 'python:3.9'
        }
    }
    
    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub')
        AWS_CREDS = credentials('aws-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                    sh 'pip install pytest pytest-cov'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'pytest --cov=app tests/'
                }
            }
            post {
                always {
                    junit 'backend/test-results/*.xml'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_HUB_CREDS_USR/aws-dashboard:$BUILD_NUMBER .'
                sh 'docker tag $DOCKER_HUB_CREDS_USR/aws-dashboard:$BUILD_NUMBER $DOCKER_HUB_CREDS_USR/aws-dashboard:latest'
            }
        }
        
        stage('Push Docker Image') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push $DOCKER_HUB_CREDS_USR/aws-dashboard:$BUILD_NUMBER'
                sh 'docker push $DOCKER_HUB_CREDS_USR/aws-dashboard:latest'
            }
        }
        
        stage('Deploy to AWS') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials',
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    dir('terraform') {
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve -var="docker_image=$DOCKER_HUB_CREDS_USR/aws-dashboard"'
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executado com sucesso!'
        }
        failure {
            echo 'Pipeline falhou!'
        }
    }
}