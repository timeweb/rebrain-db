export default {
    props: ['chosen'],
    data: () => ({
        items: [
            {name: 'users', title: 'Пользователи', link: '/index.html'},
            {name: 'subjects', title: 'Предметы', link: '/subjects.html'},
            {name: 'classes', title: 'Классы', link: '/classes.html'},
            {name: 'schedule', title: 'Расписание', link: '/schedule.html'},
        ],
    }),
    template: `
<b-menu class="box">
    <b-menu-list label="Меню">
        <b-menu-item
            v-for="item in items"
            :key="item.name"
            :label="item.title"
            :active="item.name == chosen"
            :href="item.link"
        ></b-menu-item>
    </b-menu-list>
</b-menu>`

}

