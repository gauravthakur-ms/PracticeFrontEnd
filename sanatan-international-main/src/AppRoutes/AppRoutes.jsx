import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import About from "../Pages/Hub/About/About";
import Vision from "../Pages/Hub/Vision/Vision";
import Founder from "../Pages/Hub/Founder/Founder";
import Financial from "../Pages/Hub/Financial/Financial";
import Collabration from "../Pages/Hub/Collabration/Collabration";
import Layout from "../Components/Layout/Layout";
import ComingSoon from "../Pages/ComingSoon/ComingSoon";
import NotFound from "../Pages/NotFound/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import GuestRoute from "./GuestRoute";

import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import VerifyEmailPage from "../Pages/Auth/VerifyEmailPage";
import ForgotPasswordPage from "../Pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../Pages/Auth/ResetPasswordPage";
import GoogleSuccessPage from "../Pages/Auth/GoogleSuccessPage";

import CoursesPage from "../Pages/Courses/CoursesPage";
import CourseDetailPage from "../Pages/Courses/CourseDetailPage";

import CheckoutPage from "../Pages/Checkout/CheckoutPage";
import OrderSuccessPage from "../Pages/Checkout/OrderSuccessPage";

import MyCoursesPage from "../Pages/Dashboard/MyCoursesPage";
import CourseContentPage from "../Pages/Dashboard/CourseContentPage";

import ProfilePage from "../Pages/Profile/ProfilePage";

import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminCoursesPage from "../Pages/Admin/AdminCoursesPage";
import AdminCourseFormPage from "../Pages/Admin/AdminCourseFormPage";
import AdminSubjectsPage from "../Pages/Admin/AdminSubjectsPage";
import AdminLessonsPage from "../Pages/Admin/AdminLessonsPage";
import AdminReviewsPage from "../Pages/Admin/AdminReviewsPage";
import AdminOrdersPage from "../Pages/Admin/AdminOrdersPage";
import AdminUsersPage from "../Pages/Admin/AdminUsersPage";
import AdminRequestsPage from "../Pages/Admin/AdminRequestsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<About />} />
        <Route path="vision" element={<Vision />} />
        <Route path="founders" element={<Founder />} />
        <Route path="financial-reports" element={<Financial />} />
        <Route path="collabrations" element={<Collabration />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />

        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="auth/google/success" element={<GoogleSuccessPage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="my-courses/:courseId" element={<CourseContentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout/:courseId" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/courses" element={<AdminCoursesPage />} />
            <Route path="admin/courses/new" element={<AdminCourseFormPage />} />
            <Route path="admin/courses/:courseId/edit" element={<AdminCourseFormPage />} />
            <Route path="admin/courses/:courseId/subjects" element={<AdminSubjectsPage />} />
            <Route
              path="admin/courses/:courseId/subjects/:subjectId/lessons"
              element={<AdminLessonsPage />}
            />
            <Route path="admin/reviews" element={<AdminReviewsPage />} />
            <Route path="admin/orders" element={<AdminOrdersPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/requests" element={<AdminRequestsPage />} />
          </Route>
        </Route>

        <Route path="land-acquisition" element={<ComingSoon />} />
        <Route path="gurukul-training" element={<ComingSoon />} />
        <Route path="ayurveda" element={<ComingSoon />} />
        <Route path="ebooks" element={<ComingSoon />} />
        <Route path="library" element={<ComingSoon />} />
        <Route path="apps" element={<ComingSoon />} />
        <Route path="volunteer" element={<ComingSoon />} />
        <Route path="events" element={<ComingSoon />} />
        <Route path="blog" element={<ComingSoon />} />
        <Route path="media" element={<ComingSoon />} />
        <Route path="testimonials" element={<ComingSoon />} />
        <Route path="faqs" element={<ComingSoon />} />
        <Route path="marketplace" element={<ComingSoon />} />
        <Route path="donate" element={<ComingSoon />} />
        <Route path="privacy-policy" element={<ComingSoon />} />
        <Route path="terms-of-service" element={<ComingSoon />} />
        <Route path="cookie-policy" element={<ComingSoon />} />
        <Route path="accessibility" element={<ComingSoon />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
