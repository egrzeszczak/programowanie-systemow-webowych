module.exports = {
    category: {
        "business-apps": "Aplikacje biznesowe",
        internet: "Internet",
        software: "Oprogramowanie",
        infrastructure: "Infrastruktura",
        security: "Bezpieczeństwo",
        hardware: "Sprzęt",
        other: "Inne",
    },
    priority: {
        critical: "Krytyczny",
        high: "Wysoki",
        medium: "Średni",
        low: "Niski",
        none: "Bez priorytetu",
    },
    status: {
        new: "Nowe",
        "in-progress": "W realizacji",
        done: "Ukończono",
    },
    style: {
        category: {},
        priority: {},
        status: {
            detail: {
                new: "border-l-8 border-teal-200",
                "in-progress":
                    "border-l-8 border-amber-400 bg-amber-100 dark:bg-amber-900 dark:border-amber-700",
                done: "border-l-8 border-slate-400 bg-slate-100 text-slate-400",
            },
            list: {
                new: "",
                "in-progress": "bg-amber-200 dark:bg-yellow-700",
                done: "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
            },
            table: {
                new: "border-l-8 border-teal-200",
                "in-progress":
                    "border-l-8 border-amber-400 bg-amber-100 dark:text-black",
                done: "border-l-8 border-slate-400 bg-slate-100 text-slate-400",
            },
            // TailwindCSS => Vue :class ale nie działa
            // tabletest(key) {
            //     return {
            //         "border-l-8 border-teal-200": key == "new",
            //         "border-l-8 border-amber-400 bg-amber-100 dark:text-black":
            //             key == "in-progress",
            //         "border-l-8 border-slate-400 bg-slate-100 text-slate-400":
            //             key == "done",
            //     };
            // },
            // classObject() {
            //     return {
            //       active: this.isActive && !this.error,
            //       'text-danger': this.error && this.error.type === 'fatal'
            //     }
            //   }
        },
    },
};
