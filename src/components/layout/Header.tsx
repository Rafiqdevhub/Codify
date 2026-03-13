import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { healthApi } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  User,
  LogOut,
  Settings,
  Key,
  Menu,
  X,
  Mail,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApiStatus {
  status: "online" | "offline" | "loading";
  responseTime: number;
  lastCheck: Date;
  version?: string;
  endpoints?: string[];
}

const Header = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: "loading",
    responseTime: 0,
    lastCheck: new Date(),
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the contact form data to your backend
      console.log("Contact form submitted:", contactForm);

      // Reset form and close modal
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsContactModalOpen(false);

      // You could show a success toast here
      alert("Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="relative">
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img
                    src="/codify.png"
                    alt="Codify Logo - AI-Powered Code Analysis Platform"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
              <div className="group">
                <h1 className="text-3xl font-bold text-white hover:text-blue-300 transition-all duration-300">
                  Codify
                </h1>
                <p className="text-sm text-gray-300 font-medium">
                  AI-Powered Code Analysis Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog
                open={isContactModalOpen}
                onOpenChange={setIsContactModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white shadow-2xl mx-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-xl font-bold text-white">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <span>Contact Us</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Have questions or feedback? We'd love to hear from you!
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handleContactSubmit}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="contact-name"
                          className="text-gray-200 text-sm"
                        >
                          Name
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="Your name"
                          value={contactForm.name}
                          onChange={(e) =>
                            handleContactInputChange("name", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 h-10 sm:h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="contact-email"
                          className="text-gray-200 text-sm"
                        >
                          Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="your@email.com"
                          value={contactForm.email}
                          onChange={(e) =>
                            handleContactInputChange("email", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 h-10 sm:h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-subject"
                        className="text-gray-200 text-sm"
                      >
                        Subject
                      </Label>
                      <Input
                        id="contact-subject"
                        type="text"
                        placeholder="What's this about?"
                        value={contactForm.subject}
                        onChange={(e) =>
                          handleContactInputChange("subject", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 h-10 sm:h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="contact-message"
                        className="text-gray-200 text-sm"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Tell us more..."
                        value={contactForm.message}
                        onChange={(e) =>
                          handleContactInputChange("message", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] sm:min-h-[100px] resize-none"
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsContactModalOpen(false)}
                        className="bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 hover:text-white transition-colors order-2 sm:order-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden xl:block text-right">
                    <p className="text-sm font-medium text-gray-200">Welcome</p>
                    <p className="text-sm text-gray-300">{user.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-transparent text-white font-bold">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-gray-800 backdrop-blur-sm border-white/20 shadow-xl text-white"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none text-white">
                                {user.name}
                              </p>
                              <p className="text-xs leading-none text-gray-300 mt-1">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-blue-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <User className="mr-3 h-4 w-4 text-blue-400" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/change-password")}
                        className="hover:bg-purple-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <Key className="mr-3 h-4 w-4 text-purple-400" />
                        <span>Change Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/review")}
                        className="hover:bg-indigo-700 transition-colors cursor-pointer text-gray-200 hover:text-white"
                      >
                        <Settings className="mr-3 h-4 w-4 text-indigo-400" />
                        <span>Code Review</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-700 transition-colors text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-400" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <img
                      src="/codify.png"
                      alt="Codify Logo"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Codify</h1>
                </div>
              </div>{" "}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            {isMobileMenuOpen && (
              <div className="border-t border-white/20 bg-gray-800/90 backdrop-blur-sm">
                <div className="px-4 py-4 space-y-4">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-300">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <User className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-200">Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/change-password");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Key className="h-5 w-5 text-purple-400" />
                          <span className="text-gray-200">Change Password</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/review");
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Settings className="h-5 w-5 text-indigo-400" />
                          <span className="text-gray-200">Code Review</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsContactModalOpen(true);
                            closeMobileMenu();
                          }}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-200">Contact</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-red-700 transition-colors text-red-400"
                        >
                          <LogOut className="h-5 w-5 text-red-400" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/login" onClick={closeMobileMenu}>
                        <Button
                          variant="ghost"
                          className="w-full text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                        >
                          Sign in
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          setIsContactModalOpen(true);
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center justify-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-gray-200"
                      >
                        <Mail className="h-5 w-5 text-blue-400" />
                        <span>Contact</span>
                      </button>
                      <Link to="/register" onClick={closeMobileMenu}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-400 opacity-50" />
      </div>
    </header>
  );
};

export default Header;
