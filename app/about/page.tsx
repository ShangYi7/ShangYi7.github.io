// 關於
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Instagram,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "關於",
  description: "了解有關Shangyi7的更多信息 - 一位熱情的開發人員製作數字體驗.",
};

const skills = [
  {
    category: "前端",
    technologies: ["JavaScript", "TypeScript", "HTML", "CSS", "Vue.js"],
  },
  {
    category: "後端",
    technologies: ["C/C++", "C#", "Python"],
  },
  {
    category: "系統程式設計",
    technologies: ["C/C++", "C#", "Python"],
  },
  {
    category: "硬體 & 嵌入式",
    technologies: ["Verilog", "Arduino", "CPLD", "FPGA", "ESP"],
  },
  {
    category: "腳本 & 其他語言",
    technologies: ["Lua", "Visual Basic"],
  },
  {
    category: "工具 & 其他",
    technologies: ["Markdown", "Git", "VScode", "Visual Studio", "Windows"],
  },
];

const experiences = [
  {
    title: "全國高級中等學校技藝競賽",
    company: "鶯歌工商資訊科",
    period: "2023 - 2024",
    description:
      "代表鶯歌工商參加工科技藝競賽數位電子組，主要使用 FPGA 與 Verilog 進行數位電路設計，並結合 ESP 模組與 Visual Basic 開發控制介面。最終榮獲全國第六名，展現完整系統整合與實作能力。",
  },
  {
    title: "Fivem RP 開發管理",
    company: "K.X.G",
    period: "2022/4/24 - 2022/6/23",
    description:
      "使用 QBcore 製作的一個伺服器，跟著朋友一起搞雖然資金沒有很充足，但也是和大家創造了許多回憶",
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/ShangYi7",
    icon: Github,
    description: "探索我的程式碼與專案作品",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/Shang_Yi6",
    icon: Instagram,
    description: "分享日常生活與幕後點滴",
  },
  {
    name: "Email",
    href: "mailto:ast102283@gmail.com",
    icon: Mail,
    description: "歡迎洽談合作，或是單純打聲招呼",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-full h-full rounded-full glass-medium p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-4xl font-bold text-black">
                SY
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            關於 <span className="gradient-text">ShangYi</span>
          </h1>

          <p className="text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            我是一名熱愛電子與程式開發的創作者，喜歡將靈感轉化為具體的作品。<br />
            目前就讀於國立高雄科技大學建功校區電子工程系。
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-foreground-muted">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>台灣</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>開放合作與工作機會</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>我的故事</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p>
              哈囉！我是
              ShangYi7，一名熱愛電子與程式開發的創作者，喜歡將想法轉化為有意義的數位體驗。我的科技旅程始於幾年前，從此便對程式帶來的無限可能充滿熱情。
            </p>
            <p>
              我專注於現代網頁開發，致力於打造高效、易用且美觀的應用程式。我注重撰寫乾淨且可維護的程式碼，並持續追蹤最新技術與最佳實踐。
            </p>
            <p>
              程式之外，我喜歡探索新技術、參與開源專案，並透過部落格與教學分享知識。我總是期待能與有趣的專案和開發者合作，互相交流與成長。
            </p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            技能和技術
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{skill.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm rounded-full text-accent transition-colors duration-200 hover:opacity-80"
                        style={{ backgroundColor: "var(--glass-bg)" }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            經驗
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{exp.title}</CardTitle>
                      <CardDescription className="text-accent font-medium">
                        {exp.company}
                      </CardDescription>
                    </div>
                    <span
                      className="text-sm text-foreground-muted px-3 py-1 rounded-full"
                      style={{ backgroundColor: "var(--glass-bg)" }}
                    >
                      {exp.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-muted">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            打個招呼
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card key={link.name} hover className="group">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-4 text-accent group-hover:scale-110 transition-transform duration-200" />
                    <h3 className="font-semibold text-white mb-2">
                      {link.name}
                    </h3>
                    <p className="text-sm text-foreground-muted mb-4">
                      {link.description}
                    </p>
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Connect
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="glass-medium">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                有興趣一起合作嗎？
              </h3>
              <p className="text-foreground-muted mb-6">
                我隨時歡迎討論新的機會、有趣的專案，或是單純聊聊技術相關的話題。
              </p>
              <Button asChild variant="accent" size="lg">
                <Link href="mailto:contact@shangyi7.com">
                  聯絡我
                  <Mail className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
