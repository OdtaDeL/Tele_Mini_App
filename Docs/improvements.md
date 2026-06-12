# Đề Xuất Cải Thiện Hệ Thống (Academy Hub Proposals)

Tài liệu này tổng hợp các đề xuất và định hướng nâng cấp hệ thống học tập Telegram Mini App về các khía cạnh: cấu trúc mã nguồn, tính năng, bộ câu hỏi trắc nghiệm (quizzes), và trải nghiệm người dùng (UI/UX).

---

## 1. Cấu Trúc Mã Nguồn & Kiến Trúc (Architecture & Structure)

- **Tách Biệt Lớp Dịch Vụ (Service Layer)**:
  - *Hiện tại*: Các hàm truy vấn dữ liệu từ Supabase được viết trực tiếp bên trong `AppContext.tsx` bằng `useEffect`.
  - *Cải thiện*: Nên tách các logic tương tác dữ liệu thành các service riêng trong `src/services/` (ví dụ: `userService.ts`, `moduleService.ts`, `progressService.ts`). Việc này giúp `AppContext` gọn gàng hơn, dễ quản lý và dễ viết kiểm thử (Unit Test).

- **Sử Dụng React Query / SWR**:
  - *Hiện tại*: Quản lý việc tải dữ liệu và trạng thái loading thủ công qua React State.
  - *Cải thiện*: Tích hợp `@tanstack/react-query` hoặc `swr` để quản lý việc fetch dữ liệu. Thư viện này hỗ trợ tự động lưu bộ nhớ đệm (caching), tự động đồng bộ lại khi kết nối mạng được phục hồi (revalidation), và cung cấp trạng thái tải trang (loading, error) chuyên nghiệp hơn.

- **Tái Cấu Trúc Thư Mục Thành Phần (Domain Component Structure)**:
  - *Cải thiện*: Nhóm các component theo thư mục chức năng thay vì để chung một thư mục `components` phẳng. Ví dụ:
    - `src/components/ui/` cho các nút bấm, huy hiệu, hộp thoại dùng chung.
    - `src/components/lesson/` cho trình phát video, phần hiển thị markdown của bài học.
    - `src/components/profile/` cho thẻ tiến độ, thông tin tài khoản.

- **Tối Ưu Hóa Định Tuyến (Routing & Lazy Loading)**:
  - *Cải thiện*: Sử dụng `React.lazy()` và `<Suspense>` để trì hoãn việc tải (code-splitting) cho các trang quản trị (Admin Dashboard, ModuleManager, LessonManager) vốn có kích thước code lớn và ít khi được truy cập bởi người dùng thông thường, giúp tăng tốc độ tải trang ban đầu trên thiết bị di động.

---

## 2. Nâng Cấp Chức Năng (Features & Functionality)

- **Trình Xem & Tải Tài Liệu Đính Kèm (PDF/Slide Integration)**:
  - *Hiện tại*: Cấu trúc dữ liệu bài học đã có trường liên kết tài liệu nhưng giao diện chưa hiển thị.
  - *Cải thiện*: Tích hợp nút xem trực tiếp slide bài học hoặc tải tệp tin đính kèm (PDF, bảng tính mẫu hỗ trợ phân tích kỹ thuật) ngay bên dưới phần nội dung của bài học.

- **Lưu Mốc Thời Gian Xem Video (Resume Progression)**:
  - *Cải thiện*: Ghi nhận thời gian phát video cuối cùng (ví dụ: đã xem đến phút thứ 05:30) của học viên qua cơ sở dữ liệu. Khi họ quay lại, trình phát sẽ tự động tiếp tục chạy từ vị trí đó.

- **Đồng Bộ & Thông Báo Qua Telegram Bot**:
  - *Cải thiện*: Kết nối hệ thống với một Telegram Bot chuyên biệt để gửi tin nhắn thông báo tự động (push notifications) cho học viên khi:
    - Có bài học mới được đăng tải.
    - Học viên tăng cấp độ (Level Up) hoặc đạt cột mốc chuỗi ngày học tập (Streak).
    - Có thông báo khẩn từ quản trị viên.

- **Hệ Thống Phân Quyền Nhiều Quản Trị Viên (Role Management)**:
  - *Cải thiện*: Mở rộng phân quyền tài khoản thành `SuperAdmin`, `Editor/Teacher`, và `Member`. Biên tập viên (`Editor`) có thể cập nhật tài liệu bài học nhưng không có quyền can thiệp vào dữ liệu học viên hay xóa các cấu trúc module lớn.

---

## 3. Bộ Câu Hỏi Trắc Nghiệm & Gamification (Quizzes & Practice)

- **Khóa Bài Học Bằng Trắc Nghiệm (Comprehension Checks)**:
  - *Hiện tại*: Học viên có thể nhấn "Mark as Complete" để qua bài mà không cần xem kỹ video.
  - *Cải thiện*: Yêu cầu hoàn thành một bài trắc nghiệm ngắn gồm 3-5 câu hỏi liên quan đến nội dung bài học. Chỉ khi trả lời đúng tối thiểu 80% số câu hỏi, bài học mới được tính là hoàn thành.

- **Tích Hợp Biểu Đồ Thực Hành Vẽ Vùng Cung-Cầu**:
  - *Cải thiện*: Thiết lập một khung biểu đồ tương tác (sử dụng thư viện TradingView Lightweight Charts) để học viên tự tay xác định và vẽ các vùng Cung (Supply Zone) và vùng Cầu (Demand Zone). Trình chấm điểm tự động sẽ đối chiếu tọa độ vẽ của học viên với đáp án của giáo viên.

- **Nhiệm Vụ Học Tập Hàng Ngày (Daily Quests)**:
  - *Cải thiện*: Bổ sung các nhiệm vụ như "Xem hết 1 video hôm nay" hoặc "Trả lời đúng 5 câu trắc nghiệm liên tiếp" để học viên nhận thêm XP thưởng. Chuỗi ngày học liên tục (Streak) cần có cơ chế thưởng nhân số XP nhận được (multiplier).

- **Đổi Điểm XP Lấy Huy Hiệu Hoặc Bài Học VIP**:
  - *Cải thiện*: Tạo danh sách quà tặng ảo nơi học viên dùng điểm tích lũy hoặc XP để đổi lấy các huy hiệu đặc biệt hiển thị trên Profile cá nhân hoặc mở khóa các video phân tích thị trường trực tiếp unlisted (VIP).

---

## 4. Cải Thiện Trải Nghiệm Người Dùng (UI/UX)

- **Tự Động Đồng Bộ Chủ Đề Telegram (Telegram ThemeParams)**:
  - *Cải thiện*: Đọc các giá trị màu từ đối tượng `window.Telegram.WebApp.themeParams` để tự động điều chỉnh bảng màu nền, chữ, và màu nhấn (accent) của ứng dụng theo giao diện mà người dùng đang cài đặt trên ứng dụng Telegram gốc.

- **Bộ Khung Tải Sức Sống (Skeleton Loaders)**:
  - *Cải thiện*: Thiết kế các component skeleton nhấp nháy chuyển động mờ cho trang Home và trang Learn trong thời gian đợi dữ liệu tải về từ Supabase. Điều này giúp giảm cảm giác chờ đợi mệt mỏi hơn so với việc sử dụng vòng xoay tải trang (loading spinner).

- **Trình Phát Video Tối Ưu Cho Mobile**:
  - *Cải thiện*: Viết lại khung iframe phát video để tối ưu trên màn hình dọc nhỏ gọn, bổ sung các cử chỉ vuốt chạm (swipe gestures) để tua nhanh 10 giây hoặc thay đổi độ sáng/âm lượng.

- **Hỗ Trợ Đa Ngôn Ngữ (Localization - i18n)**:
  - *Cải thiện*: Tích hợp `react-i18next` hỗ trợ hiển thị song ngữ Anh/Việt. Học viên có thể chuyển đổi ngôn ngữ hiển thị chỉ bằng một lần nhấn nút trên trang Profile cá nhân.
