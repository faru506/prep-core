import InstagramIcon from "../assets/instagram.svg?react";
import LinkedinIcon from "../assets/linkedin.svg?react";
import YoutubeIcon from "../assets/youtube.svg?react";
import GithubIcon from "../assets/github.svg?react";

const Footer = () => {
  return (
    <footer className="w-full mt-0 bg-slate-900 border border-slate-800 px-6 py-6">

      <div className="flex flex-col items-center gap-4">

        <div className="flex items-center gap-6 text-slate-400">

          <a href="https://instagram.com">
            <InstagramIcon className="w-6 h-6 hover:text-white transition" />
          </a>

          <a href="https://linkedin.com">
            <LinkedinIcon className="w-6 h-6 hover:text-white transition" />
          </a>

          <a href="https://youtube.com">
            <YoutubeIcon className="w-6 h-6 hover:text-white transition" />
          </a>

          <a href="https://github.com">
            <GithubIcon className="w-6 h-6 hover:text-white transition" />
          </a>

        </div>

        <div className="text-slate-400 text-sm text-center">
          © {new Date().getFullYear()} Interview Prep Platform. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;