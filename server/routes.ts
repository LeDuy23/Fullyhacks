import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import { 
  insertClaimantSchema, 
  insertClaimSchema, 
  insertRoomSchema, 
  insertItemSchema,
  insertDocumentationSchema,
  insertPotentialDuplicateSchema,
  insertCollaboratorSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "demo_key"
  });

  // Claimant routes
  app.post("/api/claimants", async (req, res) => {
    try {
      const validatedData = insertClaimantSchema.parse(req.body);
      const claimant = await storage.createClaimant(validatedData);
      res.status(201).json(claimant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create claimant" });
      }
    }
  });

  app.get("/api/claimants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claimant = await storage.getClaimant(id);
      
      if (!claimant) {
        return res.status(404).json({ message: "Claimant not found" });
      }
      
      res.json(claimant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claimant" });
    }
  });

  app.patch("/api/claimants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClaimantSchema.partial().parse(req.body);
      const claimant = await storage.updateClaimant(id, validatedData);
      
      if (!claimant) {
        return res.status(404).json({ message: "Claimant not found" });
      }
      
      res.json(claimant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update claimant" });
      }
    }
  });

  // Claims routes
  app.post("/api/claims", async (req, res) => {
    try {
      const validatedData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(validatedData);
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create claim" });
      }
    }
  });

  app.get("/api/claims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claim = await storage.getClaim(id);
      
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      res.json(claim);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claim" });
    }
  });

  app.get("/api/claimants/:claimantId/claims", async (req, res) => {
    try {
      const claimantId = parseInt(req.params.claimantId);
      const claims = await storage.getClaimsByClaimantId(claimantId);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  app.patch("/api/claims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClaimSchema.partial().parse(req.body);
      const claim = await storage.updateClaim(id, validatedData);
      
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      
      res.json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update claim" });
      }
    }
  });

  // Room routes
  app.post("/api/rooms", async (req, res) => {
    try {
      const validatedData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(validatedData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create room" });
      }
    }
  });

  app.get("/api/claims/:claimId/rooms", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const rooms = await storage.getRoomsByClaimId(claimId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  // Item routes
  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  app.get("/api/rooms/:roomId/items", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      const items = await storage.getItemsByRoomId(roomId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update item" });
      }
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Summary routes
  app.get("/api/claims/:id/summary", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const summary = await storage.getClaimSummary(id);
      
      if (!summary) {
        return res.status(404).json({ message: "Claim summary not found" });
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claim summary" });
    }
  });

  // AI routes for item suggestions
  app.post("/api/ai/room-items", async (req, res) => {
    try {
      const { room, homeType } = req.body;
      
      if (!room) {
        return res.status(400).json({ message: "Room name is required" });
      }

      // Fallback items if OpenAI API fails
      const fallbackItems = {
        "living room": ["TV", "Sofa", "Coffee Table", "Bookshelf", "Entertainment Center"],
        "kitchen": ["Refrigerator", "Microwave", "Toaster", "Blender", "Dishwasher"],
        "master bedroom": ["Bed", "Dresser", "Nightstand", "TV", "Closet items"],
        "bathroom": ["Shower curtain", "Towels", "Toiletries", "Medicine cabinet items"],
        "garage": ["Tools", "Lawn equipment", "Sports equipment", "Storage items"],
      };

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests common items found in a specific room for wildfire insurance documentation purposes. 
              
              You help users remember items they might have lost in a wildfire by suggesting items commonly found in specific rooms.
              
              Return a JSON object with an 'items' array. Each item in the array should have the following properties:
              - name: The name of the item
              - category: The category of the item (Electronics, Furniture, Appliances, Clothing, Jewelry, etc.)
              - estimatedCost: Estimated cost in dollars (numeric value, no currency symbol)
              - description: A brief description of the item that could help with identification
              - commonBrands: Array of 2-3 common brands for this item
              - ageInYears: Typical age of the item in years (average lifespan before replacement)
              - replacementDifficulty: How difficult to replace on a scale of 1-5 (1 = easy to replace, 5 = very difficult or irreplaceable)
              - sentimentalValue: Typical sentimental value on a scale of 1-5 (1 = low, 5 = high)
              `
            },
            {
              role: "user",
              content: `Suggest 5-10 common items typically found in a ${room}${homeType ? ` for a ${homeType}` : ''}. 
              
              Focus on both everyday items and potentially valuable or difficult-to-replace items that might be overlooked during an insurance claim.
              
              For each item, include realistic estimated costs, common brands, and other required fields to help with insurance claims documentation.`
            }
          ],
          response_format: { type: "json_object" }
        });

        const suggestedItems = JSON.parse(response.choices[0].message.content);
        res.json(suggestedItems);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Return fallback items if OpenAI fails
        const normalizedRoom = room.toLowerCase();
        const items = fallbackItems[normalizedRoom as keyof typeof fallbackItems] || 
                     fallbackItems["living room"]; // Default to living room if unknown
        
        const formattedItems = items.map((name: string) => ({
          name,
          category: "Other",
          estimatedCost: 100,
          description: `A typical ${name.toLowerCase()}`,
          commonBrands: ["Generic"],
          ageInYears: 5,
          replacementDifficulty: 2,
          sentimentalValue: 2
        }));
        
        res.json({ items: formattedItems });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get item suggestions" });
    }
  });
  
  // AI route for product links suggestions based on item description
  app.post("/api/ai/product-links", async (req, res) => {
    try {
      const { itemName, description, category } = req.body;
      
      if (!itemName) {
        return res.status(400).json({ message: "Item name is required" });
      }

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests potential product links and retailers for items being documented for insurance purposes.
              
              Return a JSON object with a 'retailers' array. Each retailer in the array should have:
              - name: Name of the retailer
              - websiteUrl: Base URL of the retailer (without specific product search)
              - searchUrl: URL to search for this specific product
              - searchTips: Tips on how to filter or navigate to find similar products
              - productCategory: The general product category on this retailer's site
              - priceRange: Estimated price range for this type of item
              `
            },
            {
              role: "user",
              content: `Suggest retailers and search links for a ${itemName} ${description ? `described as: ${description}` : ''} ${category ? `in the category: ${category}` : ''}.
              
              Focus on major retailers where replacement items could be purchased. Include both online-only retailers and brick-and-mortar stores.
              
              For each retailer, provide a specific search URL that would help locate similar products, along with tips on filtering/navigating to find comparable items.`
            }
          ],
          response_format: { type: "json_object" }
        });

        const suggestedRetailers = JSON.parse(response.choices[0].message.content);
        res.json(suggestedRetailers);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Return fallback data if OpenAI fails
        res.json({ 
          retailers: [
            {
              name: "Amazon",
              websiteUrl: "https://www.amazon.com",
              searchUrl: `https://www.amazon.com/s?k=${encodeURIComponent(itemName)}`,
              searchTips: "Filter by customer reviews and price range",
              productCategory: category || "General",
              priceRange: "$20-$200"
            },
            {
              name: "Walmart",
              websiteUrl: "https://www.walmart.com",
              searchUrl: `https://www.walmart.com/search?q=${encodeURIComponent(itemName)}`,
              searchTips: "Sort by best sellers or highest rated",
              productCategory: category || "General",
              priceRange: "$15-$150"
            }
          ] 
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get product link suggestions" });
    }
  });
  
  // AI route for analyzing images and identifying items in them
  app.post("/api/ai/analyze-image", async (req, res) => {
    try {
      const { base64Image } = req.body;
      
      if (!base64Image) {
        return res.status(400).json({ message: "Image data is required" });
      }

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that analyzes photos of household items and identifies items for insurance documentation purposes.
              
              Focus on identifying valuable or notable items that would be important for an insurance claim after a wildfire.
              
              Return a JSON object with:
              - identifiedItems: Array of items you've identified in the image
                - name: Name of the item
                - category: Category the item belongs to (Electronics, Furniture, etc.)
                - estimatedValue: Estimated value range (e.g. "$100-$500")
                - description: Brief description of the item as seen in the image
                - confidence: Your confidence level (1-5) in this identification
              - suggestions: Tips for better documenting these items for insurance
              `
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and identify any items that would be important to document for insurance purposes after a wildfire. Please be specific about what you see and provide realistic estimated values."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ],
            }
          ],
          response_format: { type: "json_object" }
        });

        const analysisResults = JSON.parse(response.choices[0].message.content);
        res.json(analysisResults);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Return fallback data if OpenAI fails
        res.json({ 
          identifiedItems: [
            {
              name: "Unknown Item",
              category: "Miscellaneous",
              estimatedValue: "Unknown",
              description: "Unable to analyze the image",
              confidence: 0
            }
          ],
          suggestions: "Please try uploading a clearer image or manually document the items you see."
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // AI route for image search suggestions based on item description
  app.post("/api/ai/image-suggestions", async (req, res) => {
    try {
      const { itemName, description, category, brand } = req.body;
      
      if (!itemName) {
        return res.status(400).json({ message: "Item name is required" });
      }

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that suggests search terms for finding images of products for insurance documentation.
              
              Return a JSON object with:
              - searchTerms: Array of effective search terms to find images of this product
              - specificDescriptors: Array of specific descriptors that help identify the exact item
              - searchEngineUrls: Object with URLs to search for images on Google, Bing, and DuckDuckGo
              - searchTips: Tips on refining image searches
              `
            },
            {
              role: "user",
              content: `Suggest image search terms and URLs for a ${brand ? `${brand} ` : ''}${itemName} ${description ? `described as: ${description}` : ''} ${category ? `in the category: ${category}` : ''}.
              
              Provide specific search terms that would help someone find images of this exact item or something very similar for insurance documentation purposes.
              
              Include direct search engine URLs for Google Images, Bing Images, and DuckDuckGo Images.`
            }
          ],
          response_format: { type: "json_object" }
        });

        const imageSuggestions = JSON.parse(response.choices[0].message.content);
        res.json(imageSuggestions);
      } catch (aiError) {
        console.error("OpenAI API Error:", aiError);
        // Return fallback data if OpenAI fails
        const searchTerm = brand ? `${brand} ${itemName}` : itemName;
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        
        res.json({ 
          searchTerms: [searchTerm, `${searchTerm} product photo`, `${searchTerm} high resolution`],
          specificDescriptors: [category || "product", "high quality", "front view"],
          searchEngineUrls: {
            google: `https://www.google.com/search?q=${encodedSearchTerm}&tbm=isch`,
            bing: `https://www.bing.com/images/search?q=${encodedSearchTerm}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodedSearchTerm}&t=h_&iax=images&ia=images`
          },
          searchTips: "Try adding the year, model number, or color for more specific results. Use terms like 'product photo' for cleaner images."
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get image search suggestions" });
    }
  });

  // Image upload handling for user-uploaded images
  app.post("/api/upload-image", async (req, res) => {
    try {
      const { itemId, base64Image, fileName, description } = req.body;
      
      if (!base64Image) {
        return res.status(400).json({ message: "Image data is required" });
      }
      
      // In a production environment, we would store this in a proper file storage service
      // like Amazon S3, Google Cloud Storage, etc.
      // For simplicity, we'll store the base64 string directly in our database
      
      // Generate a unique file name if one is not provided
      const uniqueFileName = fileName || `image_${Date.now()}.jpg`;
      
      // Create a documentation entry for this image
      const documentationData = {
        itemId: itemId ? parseInt(itemId) : 0, // Use 0 as placeholder if no item ID provided
        userId: 1, // In a real app, this would be the authenticated user's ID
        title: uniqueFileName,
        description: description || "User uploaded image",
        documentType: "photo" as const,
        sourceType: "manual_upload" as const,
        fileUrl: base64Image, // In production, this would be a URL to the stored file
        sourceUrl: null,
        sourceName: "User Upload",
        metadata: {
          upload_info: [fileName || 'unnamed', new Date().toISOString()]
        }
      };
      
      // Store the documentation
      const documentation = await storage.createDocumentation(documentationData);
      
      // Return appropriate response based on whether there was an item ID
      if (itemId) {
        return res.status(201).json(documentation);
      } else {
        // Return more details for unassociated images
        return res.status(201).json({ 
          ...documentation,
          success: true, 
          message: "Image uploaded successfully (not associated with a specific item)",
          fileName: uniqueFileName
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  
  // Documentation routes
  app.post("/api/documentations", async (req, res) => {
    try {
      const validatedData = insertDocumentationSchema.parse(req.body);
      const documentation = await storage.createDocumentation(validatedData);
      res.status(201).json(documentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create documentation" });
      }
    }
  });

  app.get("/api/items/:itemId/documentations", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const documentations = await storage.getDocumentationsByItemId(itemId);
      res.json(documentations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documentations" });
    }
  });

  app.get("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const documentation = await storage.getDocumentation(id);
      
      if (!documentation) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      
      res.json(documentation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documentation" });
    }
  });

  app.patch("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentationSchema.partial().parse(req.body);
      const documentation = await storage.updateDocumentation(id, validatedData);
      
      if (!documentation) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      
      res.json(documentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update documentation" });
      }
    }
  });

  app.delete("/api/documentations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocumentation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Documentation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete documentation" });
    }
  });

  // Potential duplicates routes
  app.get("/api/items/:itemId/duplicates", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const duplicates = await storage.getPotentialDuplicates(itemId);
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch potential duplicates" });
    }
  });

  app.post("/api/items/:itemId/detect-duplicates", async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const duplicates = await storage.detectPotentialDuplicates(itemId);
      res.json(duplicates);
    } catch (error) {
      res.status(500).json({ message: "Failed to detect potential duplicates" });
    }
  });

  app.patch("/api/duplicates/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const duplicate = await storage.updatePotentialDuplicateStatus(id, status);
      
      if (!duplicate) {
        return res.status(404).json({ message: "Potential duplicate not found" });
      }
      
      res.json(duplicate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update duplicate status" });
    }
  });

  // Collaboration routes
  app.get("/api/claims/:claimId/collaborators", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const collaborators = await storage.getCollaboratorsByClaimId(claimId);
      res.json(collaborators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborators" });
    }
  });

  app.get("/api/users/:userId/collaborations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const collaborations = await storage.getCollaboratorsByUserId(userId);
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collaborations" });
    }
  });

  app.post("/api/collaborators", async (req, res) => {
    try {
      const validatedData = insertCollaboratorSchema.parse(req.body);
      const collaborator = await storage.createCollaborator(validatedData);
      
      // In a real application, we would send an email invitation here
      // For now, just log it
      console.log(`Invitation sent to ${collaborator.email} for claim ${collaborator.claimId}`);
      
      res.status(201).json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to create collaborator" });
      }
    }
  });

  app.patch("/api/collaborators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCollaboratorSchema.partial().parse(req.body);
      const collaborator = await storage.updateCollaborator(id, validatedData);
      
      if (!collaborator) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      
      res.json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to update collaborator" });
      }
    }
  });

  app.delete("/api/collaborators/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCollaborator(id);
      
      if (!success) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete collaborator" });
    }
  });

  app.post("/api/collaborators/:id/resend-invitation", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collaborator = await storage.getCollaborator(id);
      
      if (!collaborator) {
        return res.status(404).json({ message: "Collaborator not found" });
      }
      
      // In a real application, we would resend the email invitation here
      // For now, just log it
      console.log(`Invitation resent to ${collaborator.email} for claim ${collaborator.claimId}`);
      
      res.json({ message: "Invitation resent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to resend invitation" });
    }
  });

  // WebSocket setup for real-time collaboration
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to documentation collaboration server' }));
    
    // Handle messages from clients
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'join-claim':
            // User joining a specific claim for collaboration
            if (data.claimId) {
              // In a real app, we would add the user to a claim-specific room
              console.log(`User joined claim ${data.claimId} for collaboration`);
              ws.send(JSON.stringify({ 
                type: 'join-success', 
                claimId: data.claimId 
              }));
            }
            break;
            
          case 'item-update':
            // Broadcast item updates to all connected clients
            if (data.item) {
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                  client.send(JSON.stringify({
                    type: 'item-updated',
                    item: data.item
                  }));
                }
              });
            }
            break;
            
          case 'documentation-added':
            // Broadcast new documentation to all connected clients
            if (data.documentation) {
              wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                  client.send(JSON.stringify({
                    type: 'new-documentation',
                    documentation: data.documentation
                  }));
                }
              });
            }
            break;
            
          default:
            // Unknown message type
            ws.send(JSON.stringify({ 
              type: 'error', 
              message: 'Unknown message type' 
            }));
        }
      } catch (error) {
        // Error handling
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format' 
        }));
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
