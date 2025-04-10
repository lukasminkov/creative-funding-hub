
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialIcon } from "@/components/icons/SocialIcons";

interface Application {
  id: number;
  name: string;
  avatar: string;
  platforms: string[];
  followers: number;
  totalViews: number;
  totalGmv: number;
  customQuestion1: string;
  customQuestion2: string;
  status: string;
}

interface CampaignApplicationsListProps {
  applications: Application[];
}

export default function CampaignApplicationsList({ applications }: CampaignApplicationsListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Total Views</TableHead>
            <TableHead>Total GMV</TableHead>
            <TableHead>Custom Question 1</TableHead>
            <TableHead>Custom Question 2</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map(creator => (
            <TableRow key={creator.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{creator.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {creator.platforms.map(platform => (
                    <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                      <SocialIcon platform={platform} />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>{creator.totalViews.toLocaleString()}</TableCell>
              <TableCell>${creator.totalGmv.toLocaleString()}</TableCell>
              <TableCell>{creator.customQuestion1}</TableCell>
              <TableCell>{creator.customQuestion2}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">Review</Button>
                <Button variant="ghost" size="sm">Approve</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
