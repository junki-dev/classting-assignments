news-feed-api
==============
학교 소식을 전달하고 받아보는 '학교소식 뉴스피드'를 위한 API 입니다.

## Prerequisites
![Node](https://img.shields.io/badge/nodejs-20.11.x-339933?logo=node.js)
![Yarn](https://img.shields.io/badge/yarn-1.22.x-2C8EBB?logo=Yarn)
![Docker](https://img.shields.io/badge/docker-24.0.x-2496ED?logo=docker)
![docker-compose](https://img.shields.io/badge/docker_compose-2.19.x-2496ED?logo=docker)
![Make](https://img.shields.io/badge/Make-3.81-6D00CC?logo=Make)

## Skills
![Node](https://img.shields.io/badge/nodejs-20.11.1-339933?logo=node.js) 
![Typescript](https://img.shields.io/badge/typescript-5.1-3178C6?logo=typescript)
![NestJs](https://img.shields.io/badge/Nest.js-10.1.18-E0234E?logo=NestJs)

![MongoDB](https://img.shields.io/badge/MongoDB-6.0.6-47A248?logo=MongoDB)

![Yarn](https://img.shields.io/badge/yarn-1.22.19-2C8EBB?logo=Yarn)

![Jest](https://img.shields.io/badge/jest-C21325?logo=Jest)

![Docker](https://img.shields.io/badge/docker-24.0.x-2496ED?logo=docker)
![docker-compose](https://img.shields.io/badge/docker_compose-2.19.x-2496ED?logo=docker)
![Make](https://img.shields.io/badge/Make-3.81-6D00CC?logo=Make)

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=Swagger)


## Getting Start

### Running Applications
```bash
$ make run
```

### Stopping Applications
```bash
$ make down
```

### Testing
```bash
# e2e test
$ make e2e

# e2e test coverage
$ make e2e-cov
```

## Api Documentation
- Swagger Endpoint: http://localhost:8000/api-docs

## Scenario

### 학교 페이지 운영, 소식 발행

1. 학교 관리자 계정 생성
```text
  [POST] /auth/sign-up
  {
    ...
    "role": "admin" // role 을 admin 으로 생성합니다.
  }
```

2. 로그인으로 access token 발급 
```text
  [POST] /auth/sign-in
```

3. 학교 페이지 생성
```text
  Header
    Bearer ${access token}
    
  [POST] /schools
```

4. 생성된 학교 페이지 조회
```text
  Header
    Bearer ${access token}
    
  [GET] /schools
```


5. 학교 페이지 내에 소식 작성
```text
  Header
    Bearer ${access token}
    
  [POST] /schools/feeds
  {
    ...
    "schoolId": "..." // [4]의 response body 에 _id로 확인 가능합니다.
  }
```

6. 작성된 소식 조회 - [4]와 동일(feedList object array key 로 확인 가능)

7. 작성된 소식 수정
```text
  Header
    Bearer ${access token}
    
  [PATCH] /schools/feeds/{feedId} // [6] 의 feedList 내에 _id로 확인 가능합니다.
```

8. 작성된 소식 삭제
```text
  Header
    Bearer ${access token}
    
  [DELETE] /schools/feeds/{feedId} // [6] 의 feedList 내에 _id로 확인 가능합니다.
```

---

### 학교 페이지 구독 및 소식 확인

1. 학생 계정 생성
```text
  [POST] /auth/sign-up
  {
    ...
    "role": "student" // role 을 student 으로 생성합니다.
  }
```

2. 로그인으로 access token 발급
```text
  [POST] /auth/sign-in
```

3. 학교 페이지 조회
```text
  Header
    Bearer ${access token}
    
  [GET] /schools
```

4. 학교 페이지 구독
```text
  Header
    Bearer ${access token}
    
  [POST] /users/subscriptions/schools/:schoolId // [3]의 response body 에 _id로 확인 가능합니다.
```


5. 구독한 학교 페이지 목록 조회
```text
  Header
    Bearer ${access token}
    
  [GET] /users/subscriptions/schools
```

6. 학교 페이지 구독 취소
```text
  Header
    Bearer ${access token}
    
  [DELETE] /users/subscriptions/schools/:schoolId // [3]의 response body 에 _id로 확인 가능합니다.
```

7. 학교 페이지 소식 모아보기
- 구독 시점 이후의 소식 들을 보여줍니다.
- 구독을 취소 한 경우에도 구독했던 시점의 소식은 그대로 보여줍니다.
```text
  Header
    Bearer ${access token}
    
  [PATCH] /users/subscriptions/schools/feeds
```