import React from 'react';

const MenuIntegration = ({ menuCategories, onAddToOrder }) => {
  const handleAIRecommendation = async (category, item) => {
    // This function can be called when AI recommends specific items
    const message = `Tell me more about ${item.name} from our ${category} menu`;
    // Send to AI assistant
    return message;
  };

  const generateMenuPrompt = () => {
    let prompt = "Here's our current menu:\n\n";
    
    menuCategories.forEach(category => {
      prompt += `**${category.name}**\n`;
      category.items.forEach(item => {
        prompt += `• ${item.name} - ${item.price}`;
        if (item.is_vegetarian) prompt += ' (Vegetarian)';
        if (item.is_vegan) prompt += ' (Vegan)';
        if (item.is_spicy) prompt += ' (Spicy)';
        prompt += `\n  ${item.description}\n`;
      });
      prompt += '\n';
    });
    
    return prompt;
  };

  return null; // This is a utility component
};

export default MenuIntegration;