import { useLoginLogic } from './hooks/useLoginLogic.jsx';
import { useLoginAnimations } from './styles/animations.jsx';
import LoginForm from './subcomponents/LoginForm.jsx';
import Backdrop from './subcomponents/Backdrop.jsx';
import Particles from './subcomponents/Particles.jsx';
import LoginToast from './subcomponents/LoginToast.jsx';

function Login() {
  useLoginAnimations();
  
  const {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    handleLogin,
    formRef,
    tiltStyle,
  } = useLoginLogic();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white relative overflow-hidden px-4 py-8">
      <Backdrop />
      <Particles />
      
      <div ref={formRef} className="relative z-10" style={tiltStyle}>
        <LoginForm 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          handleLogin={handleLogin}
        />
      </div>
      
      <LoginToast />
    </div>
  );
}

export default Login;