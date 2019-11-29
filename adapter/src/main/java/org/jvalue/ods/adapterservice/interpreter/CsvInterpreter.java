package org.jvalue.ods.adapterservice.interpreter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class CsvInterpreter extends Interpreter {

    private final List<InterpreterParameterDescription> parameters =  Collections.unmodifiableList(List.of(
        new InterpreterParameterDescription("columnSeparator", "Column delimiter character", Character.class),
        new InterpreterParameterDescription("lineSeparator", "Line delimiter character", String.class),
        new InterpreterParameterDescription("skipFirstDataRow", "Skip first data row (after header)", Boolean.class),
        new InterpreterParameterDescription("firstRowAsHeader", "Interpret first row as header for columns", Boolean.class)
    ));
    private final CsvMapper mapper = new CsvMapper().enable(CsvParser.Feature.WRAP_AS_ARRAY);
    private final ObjectMapper jsonMapper = new ObjectMapper();

    @Override
    public String getType() {
    return "CSV";
    }

    @Override
    public String getDescription() {
    return "Interpret data as CSV data";
    }

    @Override
    public List<InterpreterParameterDescription> getAvailableParameters() {
    return parameters;
    }

    @Override
    protected JsonNode doInterpret(String data, Map<String, Object> parameters) throws IOException {
        CsvSchema csvSchema = CsvSchema
            .emptySchema()
            .withColumnSeparator((char) parameters.get("columnSeparator"))
            .withLineSeparator((String) parameters.get("lineSeparator"))
            .withSkipFirstDataRow((boolean) parameters.get("skipFirstDataRow"));
        if((boolean) parameters.get("firstRowAsHeader")) {
            csvSchema = csvSchema
                .withHeader();
        }
        MappingIterator<Object[]> allLines = mapper
            .readerFor(Object[].class)
            .with(csvSchema)
            .readValues(data);

        ArrayNode result = mapper.createArrayNode();
        while(allLines.hasNext()) {
            result.add(jsonMapper.valueToTree(allLines.next()));
        }

        return result;
    }
}
