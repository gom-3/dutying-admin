import {LogOut, Key, Check} from 'lucide-react';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAuth} from '@/contexts/auth-context';

export const AuthSection: React.FC = () => {
  const {token, setToken, isAuthenticated, logout} = useAuth();
  const [inputToken, setInputToken] = useState('');
  const [isEditing, setIsEditing] = useState(!isAuthenticated);
  const handleSaveToken = () => {
    if (inputToken.trim()) {
      setToken(inputToken.trim());
      setIsEditing(false);
      setInputToken('');
    }
  };
  const handleLogout = () => {
    logout();
    setIsEditing(true);
    setInputToken('');
  };
  const handleEdit = () => {
    setIsEditing(true);
    setInputToken(token ?? '');
  };

  return (
    <div className="border-t p-4">
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Key className="h-4 w-4" />
          인증 토큰
        </div>

        {isAuthenticated && !isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600">인증됨</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1">
                토큰 변경
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex-1">
                <LogOut className="mr-1 h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <Label htmlFor="token-input" className="text-muted-foreground text-xs">
                관리자 토큰
              </Label>
              <Input
                id="token-input"
                type="password"
                placeholder="토큰을 입력하세요"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveToken();
                  }
                }}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleSaveToken}
              disabled={!inputToken.trim()}
              size="sm"
              className="w-full"
            >
              토큰 저장
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                <LogOut className="mr-1 h-4 w-4" />
                로그아웃
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
