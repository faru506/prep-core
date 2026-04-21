import InstagramIcon from "../assets/instagram.svg?react";
import LinkedinIcon from "../assets/linkedin.svg?react";
import YoutubeIcon from "../assets/youtube.svg?react";
import GithubIcon from "../assets/github.svg?react";

const Footer = () => {
  return (
    <footer className="w-full mt-0 bg-slate-900/60 backdrop-blur-md border border-white/10 px-4 md:px-6 py-6 md:py-8">

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">

        <div className="flex items-center gap-4 md:gap-6 text-slate-400">

          <a 
            href="https://instagram.com" 
             className="p-2 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <InstagramIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          <a 
            href="https://linkedin.com" 
             className="p-2 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <LinkedinIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          <a 
            href="https://youtube.com" 
             className="p-2 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <YoutubeIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          <a 
            href="https://github.com" 
             className="p-2 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <GithubIcon className="w-5 h-5 md:w-6 md:h-6" />
          </a>

        </div>

        <div className="text-slate-400 text-sm text-center">
          © {new Date().getFullYear()} PrepCore. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;