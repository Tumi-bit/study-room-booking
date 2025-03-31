'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RoomFilter } from '@/types';

const locations = [
  "Hauptgebäude",
  "Bibliothek",
  "MINT-Zentrum",
  "Geisteswissenschaftliches Zentrum",
  "Alle Standorte"
];

interface FilterPanelProps {
  onFilterChange: (filters: RoomFilter) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState<string>("Alle Standorte");
  const [minSize, setMinSize] = useState<string>("");
  const [hasBeamer, setHasBeamer] = useState<boolean>(false);
  const [hasWhiteboard, setHasWhiteboard] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onFilterChange({
      location: location !== "Alle Standorte" ? location : null,
      minSize: minSize ? parseInt(minSize) : null,
      hasBeamer,
      hasWhiteboard
    });
  };
  
  const handleReset = () => {
    setLocation("Alle Standorte");
    setMinSize("");
    setHasBeamer(false);
    setHasWhiteboard(false);
    
    onFilterChange({
      location: null,
      minSize: null,
      hasBeamer: false,
      hasWhiteboard: false
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filterfunktion</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Standort</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Wählen Sie einen Standort" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Mindestgröße (m²)</Label>
            <Input
              id="size"
              type="number"
              placeholder="z.B. 20"
              value={minSize}
              onChange={(e) => setMinSize(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Ausstattung</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBeamer"
                checked={hasBeamer}
                onCheckedChange={(checked) => setHasBeamer(checked === true)}
              />
              <Label htmlFor="hasBeamer" className="cursor-pointer">Beamer</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWhiteboard"
                checked={hasWhiteboard}
                onCheckedChange={(checked) => setHasWhiteboard(checked === true)}
              />
              <Label htmlFor="hasWhiteboard" className="cursor-pointer">Whiteboard</Label>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button type="submit" className="flex-1">Filtern</Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              Zurücksetzen
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;