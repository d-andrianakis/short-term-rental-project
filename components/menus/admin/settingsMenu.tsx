'use client';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SettingsMenu() {
  return (
    <ul>
        <li><Link href="/" target="_blank">Front</Link></li>
        <li>
            <Collapsible>
                <CollapsibleTrigger>
                    Settings
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="pl-5">
                        <div>
                            <Link href="/admin/settings/homepage">Homepage</Link>
                        </div>
                        <div>
                            <Link href="/admin/settings/link2">Link2</Link>
                        </div>
                        <div>
                            <Link href="/admin/settings/link3">Link3</Link>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </li>
        <li>Properties</li>
        <li>Users</li>
    </ul>
  );
}
