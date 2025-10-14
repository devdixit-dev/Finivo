import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOTP, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    const success = await verifyOTP(email, otp);
    
    if (success) {
      toast({
        title: 'Success!',
        description: 'Email verified successfully',
      });
      navigate('/login');
    } else {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
      setOtp('');
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
            Enter the 6-digit code sent to<br />
            <span className="font-medium text-foreground">{email}</span>
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
          
          <div className="bg-muted p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Demo OTP Code:</p>
            <p className="text-lg font-bold text-primary">123456</p>
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
