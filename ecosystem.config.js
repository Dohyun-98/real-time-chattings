/**
 * PM2 란?
 * PM2는 Node.js 애플리케이션을 위한 프로덕션 프로세스 관리자입니다.
 * PM2를 사용하면 Node.js 어플리케이션을 효율적으로 관리할 수 있다. 어플리케이션 로그와 메트릭 데이터를 수집하고, 이를 시각화할 수 있는 대시보드를 제공한다.
 * 
 * 명령어 (옵션 제외)
 * pm2 start ecosystem.config.js --env production
 * pm2 stop ecosystem.config.js
 * pm2 restart ecosystem.config.js
 * pm2 delete ecosystem.config.js
 * pm2 list
 * pm2 monit
 * pm2 logs
 * pm2 flush
 * pm2 reload ecosystem.config.js
 * pm2 reload all
 *
 */

module.exports = {
    apps : [
      {
      name: "gateway",
      script: "npm run dev_gateway",
    //   interpreter: "ts-node",
      // exec_mode: "cluster",
      instances: "1",
      autorestart: false,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "user",
      script: "npm run dev_user",
      // interpreter: "ts-node",
      // exec_mode: "cluster",
      instances: "1",
      autorestart: false,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "auth",
      script: "npm run dev_auth",
      // interpreter: "ts-node",
      // exec_mode: "cluster",
      instances: "1",
      autorestart: false,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "io",
      script: "npm run dev_io",
      // interpreter: "ts-node",
      // exec_mode: "cluster",
      instances: "1",
      autorestart: false,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }, 
    {
        name: "chatRoom",
        script: "npm run dev_chatRoom",
        // interpreter: "ts-node",
        // exec_mode: "cluster",
        instances: "1",
        autorestart: false,
        watch: true,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        }
      }, 
      {
        name: "chat",
        script: "npm run dev_chat",
        // interpreter: "ts-node",
        // exec_mode: "cluster",
        instances: "1",
        autorestart: false,
        watch: true,
        max_memory_restart: "1G",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        }
      }, 
  ]
  }