import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu nome completo",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu email",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu telefone",
        variant: "destructive",
      });
      return false;
    }

    if (!isLoginMode) {
      // Strong password validation for registration
      const passwordErrors: string[] = [];

      if (formData.password.length < 8) {
        passwordErrors.push("mínimo 8 caracteres");
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push("uma letra maiúscula");
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push("uma letra minúscula");
      }
      if (!/[0-9]/.test(formData.password)) {
        passwordErrors.push("um número");
      }

      if (passwordErrors.length > 0) {
        toast({
          title: "Senha fraca",
          description: `A senha deve ter: ${passwordErrors.join(", ")}`,
          variant: "destructive",
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });

      navigate("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Não foi possível realizar o login";
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create user with auto-confirm enabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (authError) {
        // Handle user already exists error
        if (authError.message.includes('User already registered')) {
          toast({
            title: "Este email já está cadastrado",
            description: "Faça login com sua conta existente ou use outro email.",
            variant: "destructive",
          });
          return;
        }
        throw authError;
      }

      // Check if user session was created (auto-confirm is enabled)
      if (authData.session) {
        // User is automatically logged in
        toast({
          title: "Conta criada com sucesso! 🎉",
          description: `Bem-vindo(a), ${formData.name}!`,
        });

        // Redirect to home page
        navigate("/");
      } else if (authData.user && !authData.session) {
        // Email confirmation is required
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });

        // Switch to login mode
        setIsLoginMode(true);
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Não foi possível realizar o cadastro";
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            Bem-vindo
          </h1>
          <p className="text-muted-foreground">
            {isLoginMode ? "Faça login na sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome completo
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone / WhatsApp
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register only) */}
          {!isLoginMode && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full btn-cta"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : isLoginMode ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isLoginMode
              ? "Não tem uma conta? "
              : "Já tem uma conta? "}
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
              }}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {isLoginMode ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
