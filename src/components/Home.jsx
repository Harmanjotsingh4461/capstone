import React, { useState, useEffect } from "react";
import { Button, Typography, Layout } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import videoSrc from "../assets/hero-video.mp4";
import heroImage from "../assets/hero-background.jpg"; // Header background image
import featureImg1 from "../assets/feature1.jpg";
import featureImg2 from "../assets/feature2.jpg";
import featureImg3 from "../assets/feature3.jpg";
import { red } from "@mui/material/colors";
import featureImg4 from "../assets/feature4.jpg";
import featureImg5 from "../assets/feature5.jpg";
import featureImg6 from "../assets/feature6.jpg";


const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// 🔹 Styled Header (Fixed at the top)
const StyledHeader = styled(Header)`
  position: fixed;
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: black;
`;

const NavbarButtons = styled.div`
  display: flex;
  gap: 12px;

  & a button {
    font-weight: 500;
    padding: 8px 20px;
  }
`;

// 🔹 Hero Section (With Background Image)
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  background: url(${heroImage}) center/cover no-repeat;
`;

const HeroOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  
  h1 {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const StyledButton = styled(Button)`
  padding: 12px 30px;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #007bff, #004e92);
  border: none;
  color: white;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background: linear-gradient(135deg, #004e92, #007bff);
    transform: translateY(-3px);
  }
`;

// 🔹 Scroll-Triggered Video Section
const VideoSection = styled(motion.section)`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? "translateY(0)" : "translateY(100px)")};
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
`;

const VideoBackground = styled.video`
  width: auto;
  height: 100vh;
  max-width: 100%;
  object-fit: cover;
`;

const MuteButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: white;
  }
`;

// 🔹 Features Section
const FeatureSection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: #f5f5f5;
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
`;

const FeatureCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  width: 320px;
  height: 380px;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  color: white;
  background-size: cover;
  background-position: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
  }
`;

const FeatureText = styled.div`
  position: relative;
  z-index: 10;
  text-align: left;

  h3 {
    font-size: 22px;
    margin-bottom: 5px;
  }
`;

const Home = () => {
  const [isMuted, setIsMuted] = useState(true);
  
  const { ref, inView } = useInView({ threshold: 0.3 });

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Layout>
      {/* 🔹 Fixed Header */}
      <StyledHeader>
        <Logo>DESC</Logo>
        <NavbarButtons>
          <Link to="/login">
            <Button type="primary">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </NavbarButtons>
      </StyledHeader>

      <Content>
        {/* 🔹 Hero Section */}
        <HeroSection>
          <HeroOverlay />
          <HeroContent
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Title style={{ fontSize: "30px", color: "white", fontWeight: "bold" }}>
  Empower your business with <span style={{ color: "#007bff" }}>DESC</span>
</Title>
<Paragraph style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.9)", maxWidth: "700px" }}>
  The ultimate platform to build, customize, and grow your online store effortlessly. From AI-driven 
  insights to seamless store management, take your brand to the next level today!
</Paragraph>
            <Link to="/signup">
              <StyledButton type="primary">Get Started</StyledButton>
            </Link>
          </HeroContent>
        </HeroSection>

        {/* 🔹 Scroll Triggered Video */}
        <VideoSection ref={ref} inView={inView}>
          <VideoBackground autoPlay loop playsInline muted={isMuted}>
            <source src={videoSrc} type="video/mp4" />
          </VideoBackground>
          <MuteButton onClick={toggleMute}>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</MuteButton>
        </VideoSection>

        {/* 🔹 Features Section */}
        <FeatureSection>
          <Title level={2}>Why Choose JoséNet?</Title>
          <FeatureGrid>
  <FeatureCard style={{ backgroundImage: `url(${featureImg1})` }}>
    <FeatureText><h3>Easy Store Setup</h3></FeatureText>
  </FeatureCard>
  <FeatureCard style={{ backgroundImage: `url(${featureImg2})` }}>
    <FeatureText><h3>Customizable Themes</h3></FeatureText>
  </FeatureCard>
  <FeatureCard style={{ backgroundImage: `url(${featureImg3})` }}>
    <FeatureText><h3>AI-Powered Insights</h3></FeatureText>
  </FeatureCard>
  <FeatureCard style={{ backgroundImage: `url(${featureImg4})` }}>
    <FeatureText><h3>Seamless Payment Integration</h3></FeatureText>
  </FeatureCard>
  <FeatureCard style={{ backgroundImage: `url(${featureImg5})` }}>
    <FeatureText><h3>Marketing & SEO Tools</h3></FeatureText>
  </FeatureCard>
  <FeatureCard style={{ backgroundImage: `url(${featureImg6})` }}>
    <FeatureText><h3>Mobile-Friendly Experience</h3></FeatureText>
  </FeatureCard>
</FeatureGrid>

        </FeatureSection>
      </Content>
    </Layout>
  );
};

export default Home;
