'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  VStack,
  Box,
  Text,
  Field,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from '@chakra-ui/react';
import { User } from 'lucide-react';
import { userService } from '@/services/api/userService';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { UserProfile, UpdateUserProfileRequest } from '@/types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function UserProfileModal({ isOpen, onClose, onUpdate }: UserProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateUserProfileRequest>({
    displayName: '',
    email: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const data = await userService.getCurrentUser();
      setProfile(data);
      setFormData({
        displayName: data.displayName || '',
        email: data.email,
        profilePictureUrl: data.profilePictureUrl || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await userService.updateCurrentUser(formData);
      
      // Update local storage with new user data
      const userData = authService.getUserData();
      if (userData) {
        authService.setUserData({
          ...userData,
          displayName: updated.displayName,
          email: updated.email,
          profilePictureUrl: updated.profilePictureUrl,
        });
      }

      toast.success('Profile updated successfully');
      onUpdate?.();
      onClose();
      
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="md">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
                    <VStack gap={4} align="stretch">
                      <Box display="flex" justifyContent="center" mb={4}>
                        {formData.profilePictureUrl ? (
                          <img
                            src={formData.profilePictureUrl}
                            alt={formData.displayName || profile?.username}
                            style={{
                              width: '128px',
                              height: '128px',
                              borderRadius: '50%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box
                            w={32}
                            h={32}
                            borderRadius="full"
                            bg="primary.500"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                          >
                            <User size={64} />
                          </Box>
                        )}
                      </Box>

              <Field.Root>
                <Field.Label>Username</Field.Label>
                <Input value={profile?.username || ''} readOnly bg="gray.50" />
                <Field.HelperText>
                  Username cannot be changed
                </Field.HelperText>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Display Name</Field.Label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your Name"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Profile Picture URL</Field.Label>
                <Input
                  value={formData.profilePictureUrl}
                  onChange={(e) => setFormData({ ...formData, profilePictureUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
                <Field.HelperText>
                  Enter a URL to your profile picture
                </Field.HelperText>
              </Field.Root>
            </VStack>
          </DialogBody>

          <DialogFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" loading={loading}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

