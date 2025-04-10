
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialIcon } from "@/components/icons/SocialIcons";

interface Creator {
  id: number;
  name: string;
  avatar: string;
  platforms: string[];
  submissions: number;
  views: number;
  status: string;
}

interface CampaignCreatorsListProps {
  creators: Creator[];
}

export default function CampaignCreatorsList({ creators }: CampaignCreatorsListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creators.map(creator => (
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
              <TableCell>{creator.submissions}</TableCell>
              <TableCell>{creator.views.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">View Profile</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
