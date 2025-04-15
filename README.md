📘 CMS Blog API
Một RESTful API cho hệ thống quản lý bài viết, hỗ trợ phân quyền (admin, editor, user), bình luận, phân loại bài viết, đếm lượt xem và tối ưu hiệu năng với Redis.

🚀 Công nghệ sử dụng
Node.js, Express

MongoDB & Mongoose

JWT Auth

Redis (cache + view counter)

Role-based access

CORS, Helmet, Compression

🔗 Link Deploy
👉 https://cms-blog-k3ap.onrender.com/

🧪 Một số API chính

Auth
POST /auth/register – Đăng ký tài khoản

POST /auth/login – Đăng nhập

User
GET /users/me – Lấy thông tin người dùng

GET /users – (admin) Xem toàn bộ user

PATCH /users/:id – Cập nhật thông tin user

DELETE /users/:id – (admin) Xóa user

Posts
POST /posts – (editor/admin) Tạo bài viết

GET /posts – Lấy danh sách bài viết (có filter/search/sort)

GET /posts/:id – Lấy chi tiết bài viết + tăng lượt xem

PATCH /posts/:id – Sửa bài viết

DELETE /posts/:id – Xóa bài viết

Comments
POST /comments/:postId – Bình luận vào bài viết

PATCH /comments/:commentId – Sửa comment

DELETE /comments/:commentId – Xóa comment

Categories
POST /categories – (admin) Tạo danh mục

GET /categories – Lấy danh sách category

🧠 Redis sử dụng cho

Cache bài viết

Tăng lượt xem (view counter)

🛡️ Phân quyền

Admin: Toàn quyền

User: Xem, bình luận
