export default {
    props: ['roles'],
    data: () => ({
        fio: '',
        role: '',
    }),
    methods: {
        create_user() {
            this.$emit('create-user', {fio: this.fio, role: this.role})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Создание пользователя</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <b-field label="fio">
                        <b-input
                            v-model="fio"
                            placeholder="ФИО"
                            required>
                        </b-input>
                    </b-field>

                    <b-field label="role">
                        <b-select placeholder="Роль" v-model="role">
                            <option
                                v-for="title, role in roles"
                                :value="role"
                                :key="role">
                                {{ title }}
                            </option>
                        </b-select>
                    </b-field>

                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Создать"
                        @click="create_user()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}
