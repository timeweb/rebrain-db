import NewUserForm from '/js/components/users_form.js'
import RebrainMenu from '/js/components/menu.js'
import Api from '/js/libs/api.js'

Vue.use('menu')
Vue.use('table')
Vue.use(Buefy, {
    defaultProgrammaticPromise: true,
})

new Vue({
    el: '#app',
    components: {
        'new-user-form': NewUserForm,
        'rebrain-menu': RebrainMenu,
    },
    data: {
        pageName: 'schedule',
        weekdays: {
            mon: 'Понедельник',
            tue: 'Вторник',
            wed: 'Среда',
            thu: 'Четверг',
            fri: 'Пятница',
        },
        times: ['9:00', '9:55', '10:40', '11:45', '12:05', '13:00'],
        subjects: [],
        users: [],
        classes: [],
        roles: {
            teacher: 'Учитель',
            student: 'Ученик',
        },
        isLoading: true,
        newUserFormActive: false,
    },
    created: async function() {
        let api_data = await Promise.all([
            Api.get_users(),
            Api.get_subjects(),
            Api.get_classes()
        ])

        this.users = api_data[0]
        this.subjects = api_data[1]
        this.classes = api_data[2]

        this.isLoading = false
    },
    methods: {
        getTeachers() {
            return this.users.filter(user => user.role == 'teacher')
        },
        async create_user(user) {
            await Api.create_user(user)
            this.users.push(user)
            this.$emit('close')
        },
        async delete_user(user_id) {
            const user = this.users.find(user => user.id == user_id)
            const result = confirm(`Точно удалить пользователя ${user.fio}?`)
            if (!result) {
                return;
            }
            await Api.delete_user(user_id)
            this.users = this.users.filter(user => user.id != user_id)
        }
    },
})

