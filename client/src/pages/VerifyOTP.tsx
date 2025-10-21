import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // handleVerify → client verifies OTP with backend
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Send OTP to your backend for verification
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify`,
        { otp },
        { withCredentials: true } // important for cookie-based tokens
      );

      if (response.data.success) {
        toast({
          description: 'Email verified successfully ✅',
        });

        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Invalid OTP. Please try again.',
          variant: 'destructive',
        });
        setOtp('');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Verification failed. Try again.';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again later.',
          variant: 'destructive',
        });
      }
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-gradient-primary"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
