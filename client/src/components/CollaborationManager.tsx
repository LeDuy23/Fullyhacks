import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Users, UserPlus, Mail, Edit, Trash2, Copy, RefreshCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define the collaborator type
interface Collaborator {
  id: number;
  claimId: number;
  userId: number;
  email: string;
  role: "owner" | "editor" | "viewer";
  inviteStatus: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  fullName?: string;
}

// Zod schema for form validation
const collaboratorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["editor", "viewer"], {
    required_error: "Please select a role",
  }),
});

type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

interface CollaborationManagerProps {
  claimId: number;
}

const CollaborationManager: React.FC<CollaborationManagerProps> = ({ claimId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isShareLinkDialogOpen, setIsShareLinkDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Function to generate a claim sharing link
  const generateShareLink = () => {
    // In a real implementation, this would make an API call to create a secure share link
    const baseUrl = window.location.origin;
    const shareToken = btoa(`claim-${claimId}-${Date.now()}`);
    return `${baseUrl}/shared/claim/${shareToken}`;
  };

  // Form setup for adding collaborators
  const form = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  // Query to fetch collaborators
  const { data: collaborators = [], isLoading } = useQuery({
    queryKey: ["/api/collaborators", claimId],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/collaborators?claimId=${claimId}`);
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch collaborators:", error);
        return [];
      }
    },
  });

  // Mutation to add a collaborator
  const addCollaboratorMutation = useMutation({
    mutationFn: async (values: CollaboratorFormValues) => {
      const response = await apiRequest("POST", "/api/collaborators", {
        claimId,
        email: values.email,
        role: values.role,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaborators", claimId] });
      toast({
        title: "Collaborator added",
        description: "They will receive an email invitation to collaborate.",
      });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add collaborator",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to remove a collaborator
  const removeCollaboratorMutation = useMutation({
    mutationFn: async (collaboratorId: number) => {
      await apiRequest("DELETE", `/api/collaborators/${collaboratorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaborators", claimId] });
      toast({
        title: "Collaborator removed",
        description: "They no longer have access to this claim.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove collaborator",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to update a collaborator role
  const updateCollaboratorMutation = useMutation({
    mutationFn: async ({ collaboratorId, role }: { collaboratorId: number; role: string }) => {
      const response = await apiRequest("PATCH", `/api/collaborators/${collaboratorId}`, {
        role,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collaborators", claimId] });
      toast({
        title: "Collaborator role updated",
        description: "Their permissions have been changed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update collaborator",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to resend invitation
  const resendInvitationMutation = useMutation({
    mutationFn: async (collaboratorId: number) => {
      const response = await apiRequest("POST", `/api/collaborators/${collaboratorId}/resend-invitation`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation resent",
        description: "A new invitation email has been sent.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to resend invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to handle form submission
  const onSubmit = (values: CollaboratorFormValues) => {
    addCollaboratorMutation.mutate(values);
  };

  // Function to handle share link generation
  const handleGenerateShareLink = () => {
    const link = generateShareLink();
    setShareLink(link);
    setIsShareLinkDialogOpen(true);
  };

  // Function to copy share link to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  // Helper function to render status badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Declined</Badge>;
      default:
        return null;
    }
  };

  // Helper function to render role badges
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Owner</Badge>;
      case "editor":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Editor</Badge>;
      case "viewer":
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">Viewer</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Manage Collaborators
              </CardTitle>
              <CardDescription>
                Invite others to view or edit this claim with you
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateShareLink}
                className="hidden sm:flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                <span>Share Link</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Collaborator</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">Loading collaborators...</div>
          ) : collaborators.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-md border border-dashed">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-700 font-medium">No collaborators yet</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Invite people to work on this claim with you. They'll be able to view or
                edit based on the permissions you give them.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add your first collaborator
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators.map((collaborator: Collaborator) => (
                    <TableRow key={collaborator.id}>
                      <TableCell className="font-medium">
                        {collaborator.email}
                        {collaborator.fullName && (
                          <div className="text-xs text-slate-500">{collaborator.fullName}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={collaborator.role}
                          onValueChange={(value) => {
                            updateCollaboratorMutation.mutate({
                              collaboratorId: collaborator.id,
                              role: value,
                            });
                          }}
                          disabled={collaborator.role === "owner"}
                        >
                          <SelectTrigger className="w-[110px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner" disabled>Owner</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStatusBadge(collaborator.inviteStatus)}
                          {collaborator.inviteStatus === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              title="Resend invitation"
                              onClick={() => resendInvitationMutation.mutate(collaborator.id)}
                            >
                              <RefreshCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {collaborator.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeCollaboratorMutation.mutate(collaborator.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-slate-50">
          <p className="text-sm text-slate-500">
            Collaborators can help document items for your claim
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateShareLink}
            className="sm:hidden flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span>Share Link</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Add Collaborator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              Add Collaborator
            </DialogTitle>
            <DialogDescription>
              Invite someone to collaborate on this claim.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      They'll receive an email invitation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="editor">Editor (can edit items)</SelectItem>
                        <SelectItem value="viewer">Viewer (read-only access)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Editors can add and modify items. Viewers can only see items.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addCollaboratorMutation.isPending}
                >
                  {addCollaboratorMutation.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={isShareLinkDialogOpen} onOpenChange={setIsShareLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Share Claim via Link
            </DialogTitle>
            <DialogDescription>
              Anyone with this link can view this claim. The link will expire in 7 days.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={shareLink}
                readOnly
                className="font-mono text-xs"
              />
            </div>
            <Button type="button" size="icon" variant="outline" onClick={copyShareLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              onClick={() => setIsShareLinkDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollaborationManager;