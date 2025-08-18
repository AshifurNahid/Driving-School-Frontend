import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const MaterialsSection = () => {
  const materials = [
    {
      id: 1,
      title: "Driver's Handbook 2024",
      type: "PDF",
      course: "Beginner Driving Course",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Road Signs Reference",
      type: "PDF",
      course: "Defensive Driving",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Highway Driving Guidelines",
      type: "PDF",
      course: "Highway Driving Mastery",
      downloadUrl: "#"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Course Materials</h2>
      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 dark:bg-red-900 p-3 rounded">
                    <Download className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{material.title}</h3>
                    <p className="text-sm text-muted-foreground">{material.course}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaterialsSection;