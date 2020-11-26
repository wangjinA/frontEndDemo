#公安
# FROM 83.102.66.34/library/nginx-hy:1.17.4
#公司
FROM 10.44.52.24/library/nginx-hy:1.17.4
MAINTAINER xwm xuweiming@hiynn.com
#将dist文件中的内容复制到/usr/share/nginx/html/这个目录下
COPY dist/ /usr/share/nginx/html/changping
#用本地的default.conf配置来替换nginx镜像里的默认配置
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 50024


