
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="mb-6 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full"></div>
            <div className="relative bg-background rounded-full p-3 border border-primary/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-14 h-14 text-primary">
                <path 
                  d="M12 2L2 7L12 12L22 7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Creator Campaign Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Launch powerful creator marketing campaigns with our intuitive platform. 
          Create, manage, and analyze your campaigns with ease.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="group">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12 md:mt-24 text-center"
      >
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Creator Campaign Platform. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
