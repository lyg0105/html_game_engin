start cmd /k "cd /d D:\work\game\js\html_game_engin\test\land_win\server&&pm2 start bin/www --watch 
timeout /t 2
start cmd /k "cd /d D:\work\game\js\html_game_engin\test\land_win\server&&pm2 start chat_server.js --watch 
timeout /t 2
start chrome http://localhost:8080