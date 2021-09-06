export default {
    props: [],
    data: () => ({
        number: 0,
        letter: '',
    }),
    methods: {
        create_class() {
            this.$emit('create-class', {number: this.number, letter: this.letter})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Создание класса</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <b-field label="Номер">
                        <b-input
                            v-model="number"
                            placeholder="Номер"
                            required>
                        </b-input>
                    </b-field>
                    <b-field label="Буква">
                        <b-input
                            v-model="letter"
                            placeholder="Буква"
                            required>
                        </b-input>
                    </b-field>

                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Создать"
                        @click="create_class()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}
