import Link from "next/link";

export default function Admin() {
    return (
        <div className="max-w-[1700px] mx-auto h-screen flex pt-10">
            <div className="w-1/4">
                <ul>
                    <li>
                        <Link href="/" target="_blank">Front</Link>
                    </li>
                    <li>
                        <Link href="/admin/properties">Properties</Link>
                    </li>
                    <li>
                        <Link href="/admin/users">Users</Link>
                    </li>
                </ul>
            </div>
            <div className="w-3/4">
                <p>Content</p>
            </div>
        </div>
    );
}