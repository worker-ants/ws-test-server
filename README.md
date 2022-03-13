# 테스트 웹소켓 서버
HAproxy, nginx, Apache 커넥션 테스트용

# endpoint
| path  | comment                 |
|-------|-------------------------|
| /     | 웹소켓 연결 테스트를 위한 html 페이지 |
| /test | 더미 API (100ms 후 응답)     |


# 환경설정
## 일반적인 사용
`docker-compose.yml`를 참고하여 사용

## 개발
* `.env` 생성 후, 아래 내용을 참고하여 설정
 
```text
PORT="8080" # 웹서버 포트 (default: 80)
```

