"use server";

import SettingsMenu from "@/components/menus/admin/settingsMenu";

export default async function Admin() {

    // const newUser = await auth.api.createUser({
    //     body: {
    //         email: "d.andrianakis@hotmail.com", // required
    //         password: "test123", // required
    //         name: "James Smith", // required
    //         data: { customField: "customValue" },
    //     },
    // });

    return (
        <div className="max-w-[1700px] mx-auto h-screen flex pt-10">
            <div className="w-1/4">
                <SettingsMenu />
            </div>
            <div className="w-3/4">
                <p>Content</p>
            </div>
        </div>
    );
}