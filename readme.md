# Hướng dẫn sử dụng Chương trình 
1. **Clone project**
2. **Cài đặt môi trường:** _**npm install**_
3. **Config aws:**
  - Vào link https://awsacademy.instructure.com/courses/5744, chọn module, chọn Learner Lab – Foundational Services, chọn Start Lab, chọn AWS Detail để lấy các id, key, token 
  - Dán các thông tin vừa lấy vào file .env theo các trường tương ứng
4. **Tạo bucket trên AWS**
  - Vào trang service S3, chọn Create Bucket
  - Nhập tên bucket (duy nhất), chọn vùng tương ứng
  - Cho phép các kết nối công khai
  - Chọn create bucket để hoàn tất việc tạo bucket
  - Gán biến bucketName trong project bằng tên bucket vừa tạo
 5. **Triển khai project lên EC2**
  - Vào trang service EC2, tạo một instance
  - Sử dụng Public DNS để connect instance trong terminal
  - Tải website lên instance bằng lệnh _**git clone https://github.com/sheep0317/CloudComputing**_
  - Cd đến thư mục website vừa tải: _**cd CloudComputing**_
  - chạy file bằng lệnh: _**npm start**_
  - Quay lại trang EC2 để lấy Public DNS 
  - Mở trình duyệt dán Public DNS và vào cổng 3000. Ví dụ: http://ec2-18-208-132-170.compute-1.amazonaws.com:3000/

